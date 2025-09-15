# Patient Management App

## Description

Application de gestion des patients avec suivi des constantes vitales, alertes critiques et visualisation des données sous forme de tableaux et graphiques.

- Dashboard : Listing des patients avec filtres (clic sur headers et pagination)
- Gestion des patients : consultation (détails), modification, 
- Tableau de synthèse avec tri, recherche et pagination
- Graphiques des constantes vitales (HeartRate, Température, Tension)
- Alertes visuelles et notifications via Toast

---

## Structure du projet

### Asset : 
### "mockPatient.json - Données patients"

### 1\. Composants Patients

| Composant                                    | Rôle / Fonctionnalités                                                                                                          |
|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `src/components/patients/DataTable.vue`      | Tableau générique pour l’affichage des données patients : colonnes dynamiques, tri, pagination, intégration avec les contrôles  |
| `PatientDetails.vue` | Détails d’un patient : infos personnelles, constantes vitales en graphique, bouton d’édition, toast de notification |
| `PatientsTable.vue` | Tableau principal des patients : colonnes dynamiques, badges de statut, pagination, recherche |
| `StatusBadge.vue` | Badge coloré indiquant le statut ou les valeurs vitales d’un patient (normal/alerte/critique) |
| `Toast.vue` | Notifications et alertes : panneau latéral des alertes critiques, bouton d’accès rapide aux détails du patient |

---

### 2. Composables

| Composable | Rôle / Fonctionnalités |
|------------|------------------------|
| `useAlerts.ts` | Gestion globale des alertes : ajout, suppression, filtrage |
| `useChartRefresh.ts` | Rafraîchissement automatique des graphiques Chart.js |
| `usePatientsTable.ts` | Logique métier pour le tableau : recherche, tri, pagination |
| `useVitalsAlert.ts` | Analyse des constantes vitales et détection des alertes critiques |
| `useVitalsChart.ts` | Préparation des datasets pour les graphiques (HeartRate, Température, Tension) |
| `useVitalsSimulation.ts` | Simulation des constantes vitales pour tests et développement |


---
`Note` | La durée de rafraîchissement des informations peut être modifiée dans les composables concernés (useVitalsSimulation.ts, useChartRefresh.ts,...). |


---

### 3. Vues

| Vue | Rôle / Fonctionnalités |
|-----|------------------------|
| `Dashboard.vue` | Tableau de bord principal : synthèse patients, alertes critiques, tableau dynamique |
| `PatientDetails.vue` | Vue complète d’un patient : infos détaillées, graphiques, accès édition |
| `PatientEdit.vue` | Formulaire de modification d’un patient avec validation et toast de confirmation |

---

### 4. Utils
| Utils                | Rôle / Fonctionnalités |
|----------------------|------------------------|
| `vitalUtils.vue`     | Fonctions utilitaires pour analyser les constantes vitales d’un patient et déterminer son statut (normal, watch, critical) selon des seuils médicaux (âge, tension, température, fréquence cardiaque). Utilisé pour l’affichage des alertes et le suivi de l’état des patients. |

---

### 5. Store
| Utils             | Rôle / Fonctionnalités |
|-------------------|------------------------|
| `patientsStore.ts` | Store Pinia centralisant la gestion des patients (état, recherche, modification, récupération des données). Initialise la liste depuis le localStorage ou le fichier mock, filtre les patients selon la recherche, met à jour les données et valide la structure des objets patients. |


## Fonctionnalités principales

- Tableau des patients avec recherche, tri et pagination
- Badge de statut dynamique pour chaque patient (rouge, jaune, vert)
- Graphiques des constantes vitales sur 24h
- Simulation des données pour tests en temps réel
- Alertes critiques avec panneau latéral et toast
- Navigation : dashboard, détails et édition
- Composables réutilisables pour logique métier et graphiques

---

## Technologies utilisées

- **Vue 3** avec Composition API
- **TypeScript**
- **Chart.js** pour graphiques
- **Tailwind CSS** pour le style
- Composants réutilisables avec `<Card>`, `<Button>`, `<Input>`, `<Label>`


---

