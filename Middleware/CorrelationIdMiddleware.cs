using System.Diagnostics;
using Serilog.Context;

namespace Dashboard.Middleware
{
    public class CorrelationIdMiddleware
    {
        private const string CorrelationIdHeader = "X-Correlation-Id";
        private readonly RequestDelegate _next;

        public CorrelationIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()
                ?? Guid.NewGuid().ToString("N");

            context.Response.Headers[CorrelationIdHeader] = correlationId;

            // Push CorrelationId and OTel TraceId (when available) into Serilog LogContext
            using (LogContext.PushProperty("CorrelationId", correlationId))
            {
                var activity = Activity.Current;
                if (activity != null)
                {
                    using (LogContext.PushProperty("TraceId", activity.TraceId.ToString()))
                    using (LogContext.PushProperty("SpanId", activity.SpanId.ToString()))
                    {
                        await _next(context);
                    }
                }
                else
                {
                    await _next(context);
                }
            }
        }
    }
}
