# frozen_string_literal: true

require "time"
require "date"

module Parking
  # Classroom tariff H02-H04. No database, authorization, or payment side effects.
  class FeeCalculator
    Result = Struct.new(:duration_seconds, :billed_hours, :amount_fen, keyword_init: true)

    def self.call(duration_seconds:, rate_fen:, coefficient: Rational(1, 1))
      unless duration_seconds.is_a?(Integer) && duration_seconds >= 0
        raise ArgumentError, "duration_seconds must be a nonnegative integer"
      end
      unless rate_fen.is_a?(Integer) && rate_fen >= 0
        raise ArgumentError, "rate_fen must be a nonnegative integer"
      end
      unless (coefficient.is_a?(Rational) || coefficient.is_a?(Integer)) && coefficient > 0
        raise ArgumentError, "coefficient must be a positive exact rational or integer"
      end

      hours = (duration_seconds + 3599) / 3600
      exact_fen = hours * rate_fen * coefficient
      # Inputs are nonnegative. Adding one half then flooring implements half-up.
      amount_fen = (exact_fen + Rational(1, 2)).floor
      Result.new(duration_seconds: duration_seconds, billed_hours: hours,
                 amount_fen: amount_fen).freeze
    end

    def self.seconds_between(entry:, cutoff:)
      times = [entry, cutoff].map do |value|
        unless value.is_a?(String) && value.match?(/\A\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)\z/)
          raise ArgumentError, "timestamp must contain whole seconds and explicit offset"
        end
        Date.iso8601(value[0, 10]) # Reject impossible calendar dates before Time normalizes them.
        Time.iso8601(value)
      end
      seconds = (times.last - times.first).to_i
      raise ArgumentError, "cutoff precedes entry" if seconds.negative?

      seconds
    end
  end
end
