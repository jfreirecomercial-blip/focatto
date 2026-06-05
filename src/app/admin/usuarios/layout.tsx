import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar Usuários - Focattolecter",
  description: "Gerenciamento de permissões, papéis (admin) e marcações de usuários profissionais ou verificados no Focattolecter.",
};

export default function AdminUsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
