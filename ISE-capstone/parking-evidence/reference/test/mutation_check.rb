# frozen_string_literal: true

require "tmpdir"
require "open3"
require "rbconfig"

source = File.read(File.expand_path("../lib/fee_calculator.rb", __dir__))
test_file = File.expand_path("fee_calculator_test.rb", __dir__)
mutants = {
  "floor_started_hours" => ["(duration_seconds + 3599) / 3600", "duration_seconds / 3600", "one_second"],
  "truncate_half_fen" => ["(exact_fen + Rational(1, 2)).floor", "exact_fen.floor", "half_fen_rounds_up"]
}
_, baseline_error, baseline = Open3.capture3(RbConfig.ruby, test_file)
abort "Baseline must pass before mutation: #{baseline_error}" unless baseline.success?

Dir.mktmpdir("parking-mutants") do |dir|
  mutants.each do |name, (original, replacement, expected_failure)|
    abort "Mutation target missing: #{name}" unless source.include?(original)
    mutant_path = File.join(dir, "#{name}.rb")
    File.write(mutant_path, source.sub(original, replacement))
    stdout, stderr, result = Open3.capture3({ "FEE_IMPLEMENTATION" => mutant_path }, RbConfig.ruby, test_file)
    # A syntax/import error is not evidence that an oracle detected the intended fault.
    unless result.exitstatus == 1 && stderr.include?("FAIL #{expected_failure}:") && stdout.include?("checks;")
      abort "SURVIVED or invalid failure: #{name}\n#{stdout}\n#{stderr}"
    end
    puts "KILLED #{name}: independent fixture #{expected_failure} failed as intended"
  end
end
puts "2/2 arithmetic mutants killed; no application-security claim"
