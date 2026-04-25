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
      console.log("Fetching tickets...");
      
      // Try fetching with profile join first
      const { data, error } = await supabase
        .from('issue_tickets')
        .select(`
          *,
          profiles:user_id (
            display_name,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching tickets:', error);
        // Fallback to simple select if join fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('issue_tickets')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        } else {
          setTickets(fallbackData || []);
        }
      } else {
        console.log("Tickets fetched successfully:", data?.length);
        setTickets(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
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
      <div className="w-full">
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body min-w-[800px] table-fixed">
                <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#fbfaf8] border-b border-gray-200">
                  <tr>
                    <th className="pl-8 pr-4 py-4 font-normal text-left w-[18%]">Name</th>
                    <th className="px-4 py-4 font-normal text-left w-[15%]">Phn Num</th>
                    <th className="px-4 py-4 font-normal text-left w-[22%]">Email</th>
                    <th className="px-4 py-4 font-normal text-left w-[15%]">Issue Type</th>
                    <th className="pl-4 pr-8 py-4 font-normal text-right w-[30%]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-body">
                        No support tickets found.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="pl-8 pr-4 py-4">
                          <span className="font-heading text-xs tracking-wider uppercase text-gray-800">
                            {ticket.profiles?.display_name || ticket.name || "Guest"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600">
                          {ticket.profiles?.phone || ticket.phone || "—"}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-600">
                          {ticket.profiles?.email || ticket.email || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-gray-800 text-xs">{ticket.subject}</span>
                        </td>
                        <td className="pl-4 pr-8 py-4 text-gray-600 leading-relaxed text-right text-xs">
                          {ticket.issue_description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
