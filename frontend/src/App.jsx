import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes.jsx"
import {Routes, Route} from "react-router-dom"
import {Layout} from "./layout/Layout.jsx"
import {ChallengeGenerator} from "./challenge/ChallengeGenerator.jsx"
import {ChallengeHistory} from "./history/ChallengeHistory.jsx"
import {WriteHistory} from "./history/WriteHistory.jsx"
import {ProWriter} from "./write/ProWriter.jsx"
import {AuthenticationPage} from "./auth/AuthenticationPage.jsx"
import { MyProfile } from "./profile/MyProfile.jsx"
import './App.css'

function App() {
  return <ClerkProviderWithRoutes>
    <Routes>
      <Route path="/sign-in/*" element={<AuthenticationPage />} />
      <Route path="/sign-up" element={<AuthenticationPage />} />
      <Route element={<Layout/>}>
        <Route path="/" element={<ChallengeGenerator />}/>
        <Route path="/challenge-history" element={<ChallengeHistory />}/>
        <Route path="/write-history" element={<WriteHistory />}/>
        <Route path="/write" element={<ProWriter />}/>
        <Route path="/profile" element={<MyProfile />}/>
      </Route>
    </Routes>
  </ClerkProviderWithRoutes>
}

export default App
