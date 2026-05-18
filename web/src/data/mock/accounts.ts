export interface MockAccount {
  id: string
  name: string
  role: "admin" | "user"
  email: string
  password: string // plain-text — DEV ONLY
  initials: string
  avatarUrl?: string
  site: string
  node?: string
  clearance: string
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "admin-1",
    name: "Sarah Jenkins",
    role: "admin",
    email: "admin@elock.dev",
    password: "Admin@1234",
    initials: "SJ",
    site: "Site-A",
    node: "Node 01",
    clearance: "Level 5 (Admin)",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: "user-1",
    name: "Alex Thompson",
    role: "user",
    email: "alex@elock.dev",
    password: "Alex@1234",
    initials: "AT",
    site: "Site-A",
    node: "Node 04",
    clearance: "Level 4 (LOTO)",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJQr4Zk5Ajl_RWtCzxqoIf5YZaan7bSMMaQMJ08nF608h4RLNYeQSn69o5y1RFzXxgRAaNqnJqwvZkP88Bidc9fei_dX4n1Cy2v04QSVrGagK9UT0dKhO7lgbZ64ZvXrBmBw-zD5FTOBsEfvAKcuW78DyYmPwweRoHLQULCThJQIZLvEapCPzHea72ib1pqrWqD7FG7yua6SfSj1xbS9d-Fzt3w7P9xb82kNneFv4gVEnLe8difazYMyZ5q2fkHd7frx4Yt0a3fw",
  },
]
