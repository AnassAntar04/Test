import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Loader2 } from 'lucide-react';
import { PROFILE_TYPES } from '@/constants/user-management';
import { UserProfileType } from '@/types/user-management';

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// const signUpSchema = z.object({
//   email: z.string().email('Email invalide'),
//   password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
//   confirmPassword: z.string(),
//   first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
//   last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
//   phone: z.string().optional(),
//   profile_type: z.enum(['agent', 'comptabilite', 'femme_de_menage', 'technicien', 'administrateur', 'responsable_logistique', 'responsable_qualite']),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Les mots de passe ne correspondent pas",
//   path: ["confirmPassword"],
// });

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
// type SignUpForm = z.infer<typeof signUpSchema>;
type NewPasswordForm = z.infer<typeof newPasswordSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, signUp, resetPassword, updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isResetMode = searchParams.get('mode') === 'reset';

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const signUpForm = useForm<SignUpForm>({
  //   resolver: zodResolver(signUpSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //     first_name: '',
  //     last_name: '',
  //     phone: '',
  //     profile_type: 'agent',
  //   },
  // });

  const newPasswordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user && !isResetMode) {
      navigate('/');
    }
  }, [user, navigate, isResetMode]);

  const onSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);
    
    if (!error) {
      navigate('/');
    }
  };

  // const onSignUp = async (data: SignUpForm) => {
  //   setIsLoading(true);
  //   const { error } = await signUp(data.email, data.password, {
  //     first_name: data.first_name,
  //     last_name: data.last_name,
  //     phone: data.phone,
  //     profile_type: data.profile_type,
  //   });
  //   setIsLoading(false);
    
  //   if (!error) {
  //     // Basculer vers l'onglet de connexion après inscription réussie
  //     setTimeout(() => {
  //       const signInTab = document.querySelector('[data-state="inactive"][value="signin"]') as HTMLElement;
  //       signInTab?.click();
  //     }, 100);
  //   }
  // };

  const onResetPassword = async () => {
    if (!resetEmail.trim()) return;
    
    setIsLoading(true);
    await resetPassword(resetEmail);
    setIsLoading(false);
    setShowResetPassword(false);
    setResetEmail('');
  };

  const onUpdatePassword = async (data: NewPasswordForm) => {
    setIsLoading(true);
    const { error } = await updatePassword(data.password);
    setIsLoading(false);
    
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-primary p-3 rounded-xl glow-pulse mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">SynergyAI Connect</h1>
          <p className="text-muted-foreground text-center">Samy Conciergerie</p>
        </div>

        {/* Mode réinitialisation de mot de passe */}
        {isResetMode ? (
          <Card>
            <CardHeader>
              <CardTitle>Nouveau mot de passe</CardTitle>
              <CardDescription>
                Entrez votre nouveau mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...newPasswordForm}>
                <form onSubmit={newPasswordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
                  <FormField
                    control={newPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mettre à jour le mot de passe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          /* Mode authentification normal */
          <Card>
            <CardHeader>
              <CardTitle>Authentification</CardTitle>
              <CardDescription>
                Connectez-vous ou créez un compte pour accéder à l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="signin">Connexion</TabsTrigger>
                  {/* <TabsTrigger value="signup">Inscription</TabsTrigger> */}
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin">
                  <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Se connecter
                      </Button>
                      
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-primary underline"
                          onClick={() => setShowResetPassword(true)}
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                {/* Sign Up Tab */}
                {/* <TabsContent value="signup">
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signUpForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Prénom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="votre@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone (optionnel)</FormLabel>
                            <FormControl>
                              <Input placeholder="+33 1 23 45 67 89" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="profile_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de profil</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez votre profil" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(PROFILE_TYPES).map(([key, label]) => (
                                  <SelectItem key={key} value={key}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Créer un compte
                      </Button>
                    </form>
                  </Form>
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Modal de réinitialisation de mot de passe */}
        {!isResetMode && showResetPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Réinitialiser le mot de passe</CardTitle>
                <CardDescription>
                  Entrez votre email pour recevoir un lien de réinitialisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={onResetPassword} 
                    disabled={isLoading || !resetEmail.trim()}
                    className="flex-1"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Envoyer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetEmail('');
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Message d'aide pour les nouveaux comptes admin */}
        {/* {!isResetMode && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Compte administrateur par défaut :</strong><br />
              Email: admin@synergyai.com<br />
              Mot de passe: AdminSynergy2025!
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Auth;