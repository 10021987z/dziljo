# 🔥 Configuration Firebase pour dziljo

## 📋 Checklist de Configuration

### 1. 🔐 Authentification (Firebase Auth)

#### Configuration dans la Console Firebase :
- ✅ **Email/Password** : Activé
- ✅ **Google** : Configuré avec OAuth
- ✅ **Apple** : Configuré (optionnel)
- ✅ **Domaines autorisés** : localhost, votre-domaine.com

#### Rôles utilisateurs configurés :
- 🔴 **admin** : Accès complet
- 🟣 **comptable** : Modules financiers + lecture
- 🟡 **rh** : Module RH + lecture
- 🟢 **commercial** : Module commercial + lecture  
- ⚪ **user** : Lecture seule

### 2. 🔄 Base de données (Cloud Firestore)

#### Structure des collections :
```
/entreprises/{entrepriseId}
  ├── /collaborateurs/{collabId}
  ├── /recrutements/{recrutementId}
  ├── /contrats/{contratId}
  ├── /clients/{clientId}
  ├── /prospects/{prospectId}
  ├── /devis/{devisId}
  ├── /factures/{factureId}
  ├── /transactions/{txnId}
  ├── /comptabilite/{periodeId}
  └── /kpis/{kpiId}

/utilisateurs/{uid}
/documents/{docId}
/notifications/{notifId}
```

#### Règles de sécurité :
- ✅ **Authentification obligatoire**
- ✅ **Isolation par entreprise**
- ✅ **Contrôle d'accès par rôle**
- ✅ **Lecture/écriture sécurisées**

### 3. ⚙️ Cloud Functions (Serverless)

#### Functions déployées :
- 📄 **generateDocument** : Génération PDF automatique
- 💰 **calculateKPIs** : Calcul KPIs en temps réel
- 💳 **stripeWebhook** : Webhooks paiements Stripe
- 🔔 **sendReminders** : Rappels automatiques quotidiens
- 📊 **generateReports** : Rapports mensuels automatiques
- 👤 **createUserWithRole** : Création utilisateur avec rôle
- 🗑️ **cleanupUserData** : Nettoyage données utilisateur
- 🔐 **assignUserRole** : Attribution rôles (admin only)

### 4. 📦 Firebase Storage

#### Structure des dossiers :
```
/entreprises/{entrepriseId}/
  ├── /documents/
  ├── /contracts/
  ├── /payslips/
  └── /reports/

/hr/{entrepriseId}/
  ├── /cv/
  ├── /contracts/
  └── /certificates/

/commercial/{entrepriseId}/
  ├── /proposals/
  └── /presentations/

/comptabilite/{entrepriseId}/
  ├── /invoices/
  └── /receipts/

/avatars/{userId}
```

#### Règles de sécurité Storage :
- ✅ **Accès par entreprise**
- ✅ **Permissions par rôle**
- ✅ **Taille limitée (10MB/fichier)**
- ✅ **Types de fichiers autorisés**

### 5. 📊 Analytics + Monitoring

#### Firebase Analytics configuré :
- 📈 **Événements trackés** :
  - `user_login`
  - `document_generated`
  - `invoice_sent`
  - `contract_signed`
  - `employee_added`
  - `prospect_converted`

#### Cloud Logging activé :
- 🔍 **Logs Functions**
- ⚠️ **Alertes erreurs**
- 📊 **Métriques performance**

## 🚀 Déploiement

### Prérequis :
```bash
npm install -g firebase-tools
firebase login
```

### Commandes de déploiement :
```bash
# Déployer tout
firebase deploy

# Déployer seulement les rules
firebase deploy --only firestore:rules

# Déployer seulement les functions
firebase deploy --only functions

# Déployer seulement le storage
firebase deploy --only storage
```

### Variables d'environnement Functions :
```bash
firebase functions:config:set \
  stripe.secret_key="sk_test_..." \
  stripe.webhook_secret="whsec_..." \
  email.user="noreply@dziljo.com" \
  email.password="app_password"
```

## 🔧 Configuration locale

### Émulateurs Firebase :
```bash
firebase emulators:start
```

### Variables d'environnement (.env) :
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🛡️ Sécurité

### Bonnes pratiques implémentées :
- ✅ **Règles Firestore strictes**
- ✅ **Validation côté serveur**
- ✅ **Chiffrement des données sensibles**
- ✅ **Audit trail des actions**
- ✅ **Rate limiting sur les Functions**
- ✅ **Validation des webhooks**

### Monitoring de sécurité :
- 🔍 **Tentatives de connexion échouées**
- ⚠️ **Accès non autorisés**
- 📊 **Utilisation anormale des APIs**

## 📞 Support

En cas de problème :
1. Vérifier les logs dans la Console Firebase
2. Tester avec les émulateurs locaux
3. Vérifier les règles de sécurité
4. Consulter la documentation Firebase

---

**🎉 Configuration Firebase complète pour dziljo !**