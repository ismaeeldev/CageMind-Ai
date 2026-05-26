"use client";

import { useEffect, useState } from "react";
import { Activity, Play, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface JobStat {
  jobName: string;
  lastRun: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  successCount: number;
  failureCount: number;
  lastDuration: number | null;
  lastError: string | null;
}

export default function AdminJobsDashboard() {
  const [jobs, setJobs] = useState<JobStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error("Failed to fetch jobs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const triggerJob = async (type: 'daily' | 'weekly') => {
    setTriggering(type);
    try {
      await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobType: type })
      });
      // Give the backend a second to insert the RUNNING state
      setTimeout(fetchJobs, 1000);
    } catch (e) {
      console.error("Failed to trigger job", e);
    } finally {
      setTriggering(null);
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "N/A";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#D22828]" />
              Background Jobs
            </h1>
            <p className="text-zinc-400 mt-2">Monitor and manually trigger background scraping and syncing processes.</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => triggerJob('daily')}
              disabled={triggering !== null}
              className="bg-zinc-800 hover:bg-[#D22828] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {triggering === 'daily' ? 'Triggering...' : 'Run Daily Tasks'}
            </button>
            <button
              onClick={() => triggerJob('weekly')}
              disabled={triggering !== null}
              className="bg-zinc-800 hover:bg-[#D22828] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {triggering === 'weekly' ? 'Triggering...' : 'Run Weekly Tasks'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#D22828] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Job Executions Found</h3>
            <p className="text-zinc-400">Trigger a job manually or wait for the scheduler to run.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.jobName} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{job.jobName}</h2>
                    <p className="text-sm text-zinc-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Last Run: {new Date(job.lastRun).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1
                    ${job.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse' : ''}
                    ${job.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                    ${job.status === 'FAILED' ? 'bg-[#D22828]/20 text-[#D22828] border border-[#D22828]/30' : ''}
                  `}>
                    {job.status === 'RUNNING' && <Activity className="w-3 h-3" />}
                    {job.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                    {job.status === 'FAILED' && <XCircle className="w-3 h-3" />}
                    {job.status}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 text-center">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Success</p>
                    <p className="text-2xl font-bold text-green-400">{job.successCount}</p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 text-center">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Failed</p>
                    <p className="text-2xl font-bold text-[#D22828]">{job.failureCount}</p>
                  </div>
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50 text-center">
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Duration</p>
                    <p className="text-2xl font-bold text-zinc-300">{formatDuration(job.lastDuration)}</p>
                  </div>
                </div>

                {/* Error Banner */}
                {job.status === 'FAILED' && job.lastError && (
                  <div className="mx-6 mb-6 p-4 bg-[#D22828]/10 border border-[#D22828]/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#D22828] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#D22828] break-words">{job.lastError}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
