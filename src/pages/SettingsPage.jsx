import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Copy, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useWeb3Auth } from '../contexts/useWeb3Auth';

const SettingsPage = () => {
  const { user, walletAddress, web3auth, provider, isConnected } = useWeb3Auth();
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPrivateKey = async () => {
    if (!web3auth || !provider) {
      setError('Web3Auth not initialized');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user logged in with social account (not external wallet)
      const userInfo = await web3auth.getUserInfo();
      
      if (!userInfo || !userInfo.idToken) {
        setError('Private key export is only available for social login accounts, not external wallets');
        setLoading(false);
        return;
      }

      // Get private key from provider
      const privateKey = await provider.request({
        method: "eth_private_key",
      });

      setPrivateKey(privateKey);
      setShowPrivateKey(true);
    } catch (err) {
      console.error('Error getting private key:', err);
      setError('Failed to retrieve private key. This feature is only available for social login accounts.');
    } finally {
      setLoading(false);
    }
  };

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hidePrivateKey = () => {
    setShowPrivateKey(false);
    setPrivateKey('');
    setError('');
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl text-gray-400 mb-4">Please connect your wallet to access settings</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Settings size={32} className="text-meda-gold" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </motion.div>

      {/* Account Info */}
      <motion.div 
        className="glassmorphism rounded-lg p-6 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-400">Wallet Address:</span>
            <p className="font-mono text-sm mt-1">{walletAddress}</p>
          </div>
          {user?.email && (
            <div>
              <span className="text-gray-400">Email:</span>
              <p className="mt-1">{user.email}</p>
            </div>
          )}
          {user?.name && (
            <div>
              <span className="text-gray-400">Name:</span>
              <p className="mt-1">{user.name}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Export Private Key */}
      <motion.div 
        className="glassmorphism rounded-lg p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Key size={24} className="text-meda-gold" />
          <h2 className="text-xl font-semibold">Export Private Key</h2>
        </div>

        <div className="bg-nebula-pink/10 border border-nebula-pink/30 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="text-nebula-pink flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-nebula-pink mb-1">Security Warning</p>
              <p className="text-gray-300">
                Never share your private key with anyone. Anyone with your private key can access your wallet and steal your funds.
              </p>
              <p className="text-gray-400 mt-2">
                Note: Private key export is only available for accounts created with social logins (Google, Twitter, etc.), not for external wallets like MetaMask.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!showPrivateKey ? (
          <button
            onClick={getPrivateKey}
            disabled={loading}
            className="btn-primary-glass flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-stellar-white"></div>
                Loading...
              </>
            ) : (
              <>
                <Key size={20} />
                Show Private Key
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-space-blue/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Private Key</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPrivateKey}
                    className="text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="font-mono text-xs break-all">
                {showPrivateKey ? privateKey : '•'.repeat(64)}
              </p>
            </div>
            <button
              onClick={hidePrivateKey}
              className="btn-secondary-glass w-full"
            >
              Hide Private Key
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;