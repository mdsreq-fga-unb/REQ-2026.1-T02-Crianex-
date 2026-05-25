export interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'owner' | 'member';
  status: 'active' | 'inactive';
  last: string;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  if (!first || first === '') return '??';
  if (parts.length === 1) return first.substring(0, 2).toUpperCase();
  const last = parts[parts.length - 1];
  if (!last) return first.substring(0, 2).toUpperCase();
  
  const firstChar = first[0] ?? '';
  const lastChar = last[0] ?? '';
  return (firstChar + lastChar).toUpperCase();
}

export function filterMembers(
  members: Member[],
  filterStatus: 'Todos' | 'active' | 'inactive',
  filterRole: 'Todos' | 'owner' | 'member',
  searchQuery: string
): Member[] {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return members.filter(m => {
    const matchStatus = filterStatus === 'Todos' || m.status === filterStatus;
    const matchRole = filterRole === 'Todos' || m.role === filterRole;
    const matchSearch = normalizedSearchQuery === '' || 
      m.name.toLowerCase().includes(normalizedSearchQuery) || 
      m.email.toLowerCase().includes(normalizedSearchQuery);
    return matchStatus && matchRole && matchSearch;
  });
}
