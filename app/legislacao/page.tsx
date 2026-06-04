"use client";

import Link from "next/link";
import { ArrowLeft, Scroll } from "@phosphor-icons/react";

export default function LegislationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-surface-300 hover:text-accent mb-8 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para a Home
      </Link>

      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Scroll size={26} weight="duotone" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Legislação e Conformidade</h1>
          <p className="text-xs text-surface-400 mt-1">Última atualização: 4 de junho de 2026</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 md:p-10 space-y-8 text-surface-200 leading-relaxed border border-white/5 shadow-glass">
        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">1. Legislação Aplicável</h2>
          <p>
            A plataforma Focatto é regida pelas leis da República Federativa do Brasil. Nossos serviços, termos de uso e políticas são desenhados para estar em estrita conformidade com a legislação civil, consumerista e de proteção de dados vigente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">2. Código de Defesa do Consumidor (CDC)</h2>
          <p>
            Como um marketplace que conecta vendedores (profissionais e particulares) a compradores, ressaltamos que:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-surface-300">
            <li>
              Nas relações de consumo entre usuários e vendedores comerciais/profissionais registrados, aplicam-se integralmente as normas do CDC (Lei nº 8.078/1990), incluindo o direito de arrependimento de 7 dias para compras online.
            </li>
            <li>
              Nas transações ocasionais entre dois usuários particulares (pessoas físicas), a relação é regida pelo Código Civil brasileiro, aplicando-se as regras de compra e venda comum.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">3. Lei Geral de Proteção de Dados (LGPD)</h2>
          <p>
            Em conformidade com a Lei nº 13.709/2018 (LGPD), garantimos o tratamento ético, transparente e seguro dos seus dados pessoais. Seus direitos de acesso, retificação, oposição e exclusão de dados podem ser exercidos diretamente no painel do usuário ou enviando um e-mail para nossa equipe de privacidade.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">4. Marco Civil da Internet</h2>
          <p>
            Em conformidade com a Lei nº 12.965/2014, a Focatto, na qualidade de provedora de aplicação de internet, adota medidas técnicas e organizacionais para a guarda de registros de acesso (logs) sob sigilo, em ambiente seguro e controlado, pelo prazo legal de 6 meses.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">5. Decreto do E-commerce</h2>
          <p>
            Seguindo as diretrizes do Decreto Federal nº 7.962/2013, apresentamos em nossos canais informações claras a respeito dos produtos, preços, formas de pagamento, prazos de entrega e canais de atendimento ao cliente, visando a melhor experiência de compra e venda segura.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-semibold text-white">6. Canal de Atendimento de Conformidade</h2>
          <p>
            Caso identifique qualquer anúncio ou conduta na plataforma que viole a legislação brasileira ou os direitos de propriedade intelectual de terceiros, por favor relate imediatamente através do canal de denúncias ou pelo e-mail{" "}
            <a href="mailto:suporte@focatto.com" className="text-accent hover:underline">
              suporte@focatto.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
