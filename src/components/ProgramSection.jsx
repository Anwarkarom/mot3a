import React from 'react';

export default function ProgramSection({ title, subtitle, children }) {
  return (
    <section className="neomorph-soft p-5 sm:p-6 rounded-2xl mb-4 card-hover">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-olive">{title}</h3>
          {subtitle && <p className="text-sm text-olive/70">{subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
