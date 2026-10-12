# frozen_string_literal: true

require "json"
require ENV.fetch("FEE_IMPLEMENTATION", File.expand_path("../lib/fee_calculator", __dir__))

# A dependency-free assertion runner keeps the seed runnable without installing gems.
module Check
  @count = 0
  @failures = []
  class << self
    def test(name)
      @count += 1
      yield
      puts "PASS #{name}"
    rescue StandardError => error
      @failures << name
      warn "FAIL #{name}: #{error.class}: #{error.message}"
    end

    def equal(expected, actual)
      raise "expected #{expected.inspect}, got #{actual.inspect}" unless expected == actual
    end

    def rejects
      begin
        yield
      rescue ArgumentError
        return
      end
      raise "expected ArgumentError"
    end

    def finish
      puts "#{@count} checks; #{@failures.length} failures"
      exit(@failures.empty? ? 0 : 1)
    end
  end
end

fixtures = JSON.parse(File.read(File.expand_path("../fixtures/fee_cases.json", __dir__)))
fixtures.each do |row|
  Check.test(row.fetch("id")) do
    result = Parking::FeeCalculator.call(
      duration_seconds: row.fetch("seconds"), rate_fen: row.fetch("rate_fen"),
      coefficient: Rational(*row.fetch("coefficient"))
    )
    Check.equal(row.fetch("hours"), result.billed_hours)
    Check.equal(row.fetch("amount_fen"), result.amount_fen)
    Check.equal(true, result.frozen?)
  end
end

[-1, 1.5, nil, "60"].each do |bad|
  Check.test("reject duration #{bad.inspect}") do
    Check.rejects { Parking::FeeCalculator.call(duration_seconds: bad, rate_fen: 1000) }
  end
end
[-1, 10.0, nil].each do |bad|
  Check.test("reject rate #{bad.inspect}") do
    Check.rejects { Parking::FeeCalculator.call(duration_seconds: 60, rate_fen: bad) }
  end
end
[0, -1, 1.5, nil].each do |bad|
  Check.test("reject coefficient #{bad.inspect}") do
    Check.rejects do
      Parking::FeeCalculator.call(duration_seconds: 60, rate_fen: 1000, coefficient: bad)
    end
  end
end
Check.test("same instant with different offsets") do
  Check.equal(0, Parking::FeeCalculator.seconds_between(
    entry: "2026-09-28T09:00:00+08:00", cutoff: "2026-09-28T01:00:00Z"))
end
Check.test("source-style one hour") do
  seconds = Parking::FeeCalculator.seconds_between(
    entry: "2026-09-28T09:00:00+08:00", cutoff: "2026-09-28T10:00:00+08:00")
  Check.equal(3600, seconds)
  Check.equal(1000, Parking::FeeCalculator.call(duration_seconds: seconds, rate_fen: 1000).amount_fen)
end
Check.test("reject reversed time") do
  Check.rejects do
    Parking::FeeCalculator.seconds_between(entry: "2026-09-28T10:00:00Z", cutoff: "2026-09-28T09:00:00Z")
  end
end
["2026-09-28T09:00:00", "2026-09-28T09:00:00.5Z", "not-a-time", "2026-02-30T09:00:00Z", "2026-09-28T24:00:00Z", "2026-09-28T09:60:00Z", nil].each do |bad|
  Check.test("reject unqualified or invalid timestamp #{bad}") do
    Check.rejects do
      Parking::FeeCalculator.seconds_between(entry: bad, cutoff: "2026-09-28T10:00:00Z")
    end
  end
end
Check.finish
