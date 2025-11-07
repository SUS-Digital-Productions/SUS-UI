import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useBlockchainNode } from '@/hooks/use-blockchain-node';
import { useHyperion } from '@/hooks/use-hyperion';
import { fetchAccount } from '@/api/blockchainApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  User, 
  Wallet, 
  HardDrive, 
  Network, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useState } from 'react';
import { fetchActions, fetchTokens } from '@/api/hyperionApi';

export function AccountPage() {
  const { account } = useParams<{ account: string }>();
  const { endpoint: blockchainEndpoint } = useBlockchainNode();
  const { endpoint: hyperionEndpoint } = useHyperion();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch account data from blockchain node
  const { data: accountData, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['account', account, blockchainEndpoint],
    queryFn: () => fetchAccount(blockchainEndpoint, account!),
    enabled: !!account,
  });

  // Fetch tokens from Hyperion
  const { data: tokensData, isLoading: isLoadingTokens } = useQuery({
    queryKey: ['tokens', account, hyperionEndpoint],
    queryFn: () => fetchTokens(hyperionEndpoint, account!),
    enabled: !!account,
  });

  // Fetch actions from Hyperion
  const { data: actionsData, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actions', account, hyperionEndpoint],
    queryFn: () => fetchActions(hyperionEndpoint, account!),
    enabled: !!account,
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatWAX = (balance: string | undefined) => {
    if (!balance) return '0 WAX';
    return balance;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getResourcePercentage = (used: number, max: number) => {
    if (max === 0) return 0;
    return ((used / max) * 100).toFixed(2);
  };

  const calculateStaked = () => {
    if (!accountData?.self_delegated_bandwidth) return '0 WAX';
    const cpu = parseFloat(accountData.self_delegated_bandwidth.cpu_weight.split(' ')[0] || '0');
    const net = parseFloat(accountData.self_delegated_bandwidth.net_weight.split(' ')[0] || '0');
    return `${(cpu + net).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} WAX`;
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-muted-foreground">No account specified</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 space-y-4">
      {/* Header - More compact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{account}</h1>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(account, 'Account name')}
              >
                {copiedField === 'Account name' ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Created {new Date(accountData?.created || '').toLocaleDateString()} • 
              Block #{accountData?.head_block_num.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {isLoadingAccount ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-3 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : accountData ? (
        <>
          {/* Stats Cards - More compact, 2 rows on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">Balance</CardTitle>
                <Wallet className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold">
                  {formatWAX(accountData.core_liquid_balance)}
                </div>
              </CardContent>
            </Card>

            {/* Staked */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">Staked</CardTitle>
                <Wallet className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold">{calculateStaked()}</div>
                <div className="flex gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                  <span>CPU: {accountData.self_delegated_bandwidth?.cpu_weight || '0'}</span>
                  <span>NET: {accountData.self_delegated_bandwidth?.net_weight || '0'}</span>
                </div>
              </CardContent>
            </Card>

            {/* RAM */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">RAM</CardTitle>
                <HardDrive className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold">
                  {getResourcePercentage(accountData.ram_usage, accountData.ram_quota)}%
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatBytes(accountData.ram_usage)} / {formatBytes(accountData.ram_quota)}
                </p>
              </CardContent>
            </Card>

            {/* Total Resources Value */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">Resources</CardTitle>
                <Network className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-base font-bold">
                  {accountData.total_resources ? (
                    <>
                      {(
                        parseFloat(accountData.total_resources.cpu_weight.split(' ')[0]) +
                        parseFloat(accountData.total_resources.net_weight.split(' ')[0])
                      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} WAX
                    </>
                  ) : '0 WAX'}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatBytes(accountData.total_resources?.ram_bytes || 0)} RAM
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resources - More compact side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* CPU */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-primary" />
                    <CardTitle className="text-sm">CPU</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {getResourcePercentage(accountData.cpu_limit.used, accountData.cpu_limit.max)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Used</span>
                    <p className="font-medium">{(accountData.cpu_limit.used / 1000).toFixed(2)} ms</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available</span>
                    <p className="font-medium">{(accountData.cpu_limit.available / 1000).toFixed(2)} ms</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max</span>
                    <p className="font-medium">{(accountData.cpu_limit.max / 1000).toFixed(2)} ms</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${getResourcePercentage(accountData.cpu_limit.used, accountData.cpu_limit.max)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* NET */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5 text-primary" />
                    <CardTitle className="text-sm">NET</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {getResourcePercentage(accountData.net_limit.used, accountData.net_limit.max)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Used</span>
                    <p className="font-medium">{formatBytes(accountData.net_limit.used)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Available</span>
                    <p className="font-medium">{formatBytes(accountData.net_limit.available)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max</span>
                    <p className="font-medium">{formatBytes(accountData.net_limit.max)}</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${getResourcePercentage(accountData.net_limit.used, accountData.net_limit.max)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voter Info - More compact */}
          {accountData.voter_info && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Voting Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <p className="text-muted-foreground text-[10px]">Proxy</p>
                    <p className="font-mono font-medium">{accountData.voter_info.proxy || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px]">Staked</p>
                    <p className="font-medium">
                      {(accountData.voter_info.staked / 10000).toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} WAX
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px]">Last Claim</p>
                    <p className="font-medium">
                      {accountData.voter_info.last_claim_time ? 
                        new Date(accountData.voter_info.last_claim_time).toLocaleDateString() : 
                        'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grid layout - Tokens and Permissions side by side, Actions below */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Tokens - Compact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tokens</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                {isLoadingTokens ? (
                  <div className="space-y-1.5">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : tokensData?.tokens && tokensData.tokens.length > 0 ? (
                  <div className="space-y-1">
                    {tokensData.tokens.map((token, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-1.5 border rounded hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Badge variant="outline" className="text-[10px] px-1 py-0">{token.symbol}</Badge>
                          <span className="text-[10px] text-muted-foreground truncate">{token.contract}</span>
                        </div>
                        <span className="font-mono text-xs font-semibold shrink-0">
                          {(token.amount / Math.pow(10, token.precision)).toLocaleString(undefined, {
                            minimumFractionDigits: token.precision,
                            maximumFractionDigits: token.precision,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-xs">No tokens found</p>
                )}
              </CardContent>
            </Card>

            {/* Permissions - Compact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Permissions</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {accountData.permissions.map((perm, index) => (
                    <div key={index} className="border rounded p-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="default" className="text-[10px] px-1 py-0">{perm.perm_name}</Badge>
                          {perm.parent && (
                            <span className="text-[10px] text-muted-foreground">
                              ← {perm.parent}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          T:{perm.required_auth.threshold}
                        </Badge>
                      </div>
                      
                      {perm.required_auth.keys.length > 0 && (
                        <div className="space-y-1 mt-1">
                          {perm.required_auth.keys.map((key, keyIndex) => (
                            <div
                              key={keyIndex}
                              className="flex items-center justify-between bg-muted/50 p-1 rounded text-[10px] font-mono"
                            >
                              <span className="truncate mr-1">{key.key}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <Badge variant="secondary" className="text-[9px] px-1 py-0">
                                  {key.weight}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0"
                                  onClick={() => copyToClipboard(key.key, 'Public key')}
                                >
                                  {copiedField === 'Public key' ? (
                                    <Check className="h-2.5 w-2.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-2.5 w-2.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {perm.required_auth.accounts.length > 0 && (
                        <div className="space-y-1 mt-1">
                          {perm.required_auth.accounts.map((acc, accIndex) => (
                            <div
                              key={accIndex}
                              className="flex items-center justify-between bg-muted/50 p-1 rounded text-[10px]"
                            >
                              <span className="font-mono truncate">
                                {acc.permission.actor}@{acc.permission.permission}
                              </span>
                              <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0">
                                {acc.weight}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions - Full width below */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActions ? (
                <div className="space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : actionsData?.actions && actionsData.actions.length > 0 ? (
                <div className="space-y-1">
                  {actionsData.actions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-1.5 border rounded hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Badge variant="outline" className="text-[10px] px-1 py-0">{action.act.name}</Badge>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {action.act.account}
                          </span>
                        </div>
                        <p className="text-[9px] text-muted-foreground">
                          Block #{action.block_num.toLocaleString()} • {new Date(action.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        asChild
                      >
                        <a
                          href={`https://waxblock.io/transaction/${action.trx_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4 text-xs">No recent actions found</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Account not found</p>
        </div>
      )}
    </div>
  );
}
