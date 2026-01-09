import { useState } from 'react';
import { formatCPF } from '@/utils/formatters';
import { SystemUser, Profile } from '@/types/access-control';
import { systemUsers, systemProfiles, addAuditLog } from '@/data/accessControlMockData';
import { franchises } from '@/data/mockData';
import { Franchise } from '@/types/pdv';
import loginBackground from '@/assets/login-background.jpeg';
import unyPneusLogo from '@/assets/unypneus-logo.png';

interface LoginScreenProps {
  onLogin: (user: SystemUser, profile: Profile, franchise: Franchise) => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Buscar usuário pelo CPF
    const user = systemUsers.find(u => u.cpf === cpf && u.password === password);

    if (!user) {
      setError('CPF ou senha inválidos');
      return;
    }

    if (!user.active) {
      setError('Usuário inativo. Contate o administrador.');
      return;
    }

    // Buscar perfil do usuário
    const profile = systemProfiles.find(p => p.id === user.profileId);
    if (!profile) {
      setError('Perfil não encontrado');
      return;
    }

    // Buscar franquia do usuário (ou primeira se tiver acesso a todas)
    const franchise = user.franchiseId 
      ? franchises.find(f => f.id === user.franchiseId)
      : franchises[0];

    if (!franchise) {
      setError('Franquia não encontrada');
      return;
    }

    // Registrar log de login
    addAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'login',
      description: 'Login realizado com sucesso',
    });

    onLogin(user, profile, franchise);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={unyPneusLogo} alt="UnyPneus" className="h-16 mx-auto mb-2" />
          <p className="text-white/80">Em todas estradas com você</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-pdv p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-2">
              CPF do Usuário
            </label>
            <input
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 rounded-xl border border-pdv-border bg-white text-pdv-gray-dark placeholder:text-pdv-gray focus:outline-none focus:ring-2 focus:ring-pdv-blue focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-xl border border-pdv-border bg-white text-pdv-gray-dark placeholder:text-pdv-gray focus:outline-none focus:ring-2 focus:ring-pdv-blue focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-pdv-blue text-white font-semibold rounded-xl hover:bg-pdv-blue-dark transition-colors shadow-pdv-button"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
