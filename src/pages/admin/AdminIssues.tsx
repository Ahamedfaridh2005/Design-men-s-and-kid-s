import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquareWarning, RefreshCw, Clock } from "lucide-react";

export default function AdminIssues() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issue_tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Set up Realtime Subscription for issue_tickets table
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'issue_tickets' },
        (payload) => {
          // Prepend the new ticket safely to the existing array safely without a formal refresh
          setTickets((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Support</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c] flex items-center gap-3">
            <MessageSquareWarning size={28} className="text-[#fb641b]" />
            Issue Tickets
          </h1>
          <button onClick={fetchTickets} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-black transition-colors px-4 py-2 border border-gray-200">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          {loading && tickets.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500 font-body">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-heading text-lg text-gray-800">Inbox Zero</h3>
              <p className="text-sm text-gray-500 font-body mt-1">There are no pending support issues right now.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left font-body min-w-[800px]">
                <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#fbfaf8] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-normal w-32">Ticket ID</th>
                    <th className="px-6 py-4 font-normal">Subject</th>
                    <th className="px-6 py-4 font-normal w-[40%]">Description</th>
                    <th className="px-6 py-4 font-normal text-center">Status</th>
                    <th className="px-6 py-4 font-normal text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        {ticket.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                        {ticket.issue_description}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                          ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-400">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
