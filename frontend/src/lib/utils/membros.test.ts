import { describe, it, expect } from 'vitest';
import { getInitials, filterMembers, type Member } from './membros';

describe('getInitials', () => {
  it('should return initials for two-word names', () => {
    expect(getInitials('Marina Pereira')).toBe('MP');
    expect(getInitials('Ricardo Lopes')).toBe('RL');
  });

  it('should return first and last initials for multi-word names', () => {
    expect(getInitials('Beatriz Carvalho Negrão')).toBe('BN');
    expect(getInitials('Joana Maria de Velasco')).toBe('JV');
  });

  it('should return uppercase initials for single-word names', () => {
    expect(getInitials('Tiago')).toBe('TI');
    expect(getInitials('x')).toBe('X');
  });

  it('should return ?? for empty names', () => {
    expect(getInitials('')).toBe('??');
    expect(getInitials('   ')).toBe('??');
  });
});

describe('filterMembers', () => {
  const mockMembers: Member[] = [
    {
      id: '1',
      name: 'Marina Pereira',
      email: 'marina@crianex.com.br',
      initials: 'MP',
      role: 'owner',
      status: 'active',
      last: 'Agora',
    },
    {
      id: '2',
      name: 'Ricardo Lopes',
      email: 'ricardo@crianex.com.br',
      initials: 'RL',
      role: 'member',
      status: 'active',
      last: '10m',
    },
    {
      id: '3',
      name: 'Tiago Albuquerque',
      email: 'tiago@crianex.com.br',
      initials: 'TA',
      role: 'member',
      status: 'inactive',
      last: '1d',
    },
  ];

  it('should return all members when filters are set to Todos and search is empty', () => {
    const result = filterMembers(mockMembers, 'Todos', 'Todos', '');
    expect(result).toHaveLength(3);
  });

  it('should filter by status correctly', () => {
    const active = filterMembers(mockMembers, 'active', 'Todos', '');
    expect(active).toHaveLength(2);
    expect(active.map((m) => m.id)).toContain('1');
    expect(active.map((m) => m.id)).toContain('2');

    const inactive = filterMembers(mockMembers, 'inactive', 'Todos', '');
    expect(inactive).toHaveLength(1);
    expect(inactive[0]?.id).toBe('3');
  });

  it('should filter by role correctly', () => {
    const owners = filterMembers(mockMembers, 'Todos', 'owner', '');
    expect(owners).toHaveLength(1);
    expect(owners[0]?.id).toBe('1');

    const members = filterMembers(mockMembers, 'Todos', 'member', '');
    expect(members).toHaveLength(2);
    expect(members.map((m) => m.id)).toContain('2');
    expect(members.map((m) => m.id)).toContain('3');
  });

  it('should filter by search query (name or email) case-insensitively', () => {
    const searchByName = filterMembers(mockMembers, 'Todos', 'Todos', 'ricardo');
    expect(searchByName).toHaveLength(1);
    expect(searchByName[0]?.id).toBe('2');

    const searchByEmail = filterMembers(mockMembers, 'Todos', 'Todos', 'crianex.com.br');
    expect(searchByEmail).toHaveLength(3);

    const searchNoMatch = filterMembers(mockMembers, 'Todos', 'Todos', 'nonexistent');
    expect(searchNoMatch).toHaveLength(0);
  });
});
