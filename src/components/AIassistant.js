import useAuth from '../hooks/useAuth'
import { useRef, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function AIassistant() {
  const { dark } = useAuth()
  const errRef = useRef()
  const [symptoms, setSymptoms] = useState('')
  const [storedSymptoms, setStoredSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const axiosPrivate = useAxiosPrivate()

  const [chatHistory, setChatHistory] = useState([])
  const [awaitingDeptConfirmation, setAwaitingDeptConfirmation] = useState(false)

  const handleSearch = async () => {
    if (!symptoms.trim()) return

    try {
      setLoading(true)
      setErrMsg("")
      const userInput = symptoms.trim().toLowerCase()

      // ✅ Add user message
      setChatHistory(prev => [...prev, { role: "user", text: symptoms }])

      // ✅ User says "no"
      if (awaitingDeptConfirmation && userInput === "no") {
        setChatHistory(prev => [...prev, { role: "assistant", text: "Take care! 💙" }])
        setAwaitingDeptConfirmation(false)
        setSymptoms("")
        return
      }

      // ✅ User says "yes"
      if (awaitingDeptConfirmation && userInput === "yes") {
        const response = await axiosPrivate.post(
          "/recommend-department",
          JSON.stringify({ symptoms: storedSymptoms, confirm: userInput })
        )

        const dept = response.data.departmentRecommendation

        let specialistMatch = dept.match(/\*\*Dr\.?\s*([A-Za-z]+)/);
        let specialist = specialistMatch ? specialistMatch[1] : "Priyanka";
        console.log(specialist)

        setChatHistory(prev => [
          ...prev,
          {
            role: "assistant",
            text: `You should book an appointment with the **${dept}** department.`
          },
          {
            role: "assistant",
            isLink: true,
            link: `/account/new-appointment?specialist=${encodeURIComponent(specialist)}`,
            label: "👉 Book Now"
          }
        ])

        setAwaitingDeptConfirmation(false)
        setSymptoms("")
        return
      }

      // ✅ Normal symptom check
      const response = await axiosPrivate.post(
        "/symptom",
        JSON.stringify({ symptoms })
      )

      setStoredSymptoms(symptoms)

      if (response.data.message) {
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", text: response.data.message }
        ])
      }

      if (response.data.symptomAnalysis) {
        setChatHistory(prev => [
          ...prev,
          { role: "assistant", text: response.data.symptomAnalysis },
          { role: "assistant", text: response.data.nextAction }
        ])
        setAwaitingDeptConfirmation(true)
      }

      setSymptoms("")
    } catch (err) {
      console.error(err)
      if (!err.response) {
        setErrMsg("⚠️ Server Unreachable")
      } else if (err.response.status === 400) {
        setErrMsg(err.response.data.message)
      } else {
        setErrMsg(err.response.data?.message || "Error getting details.")
      }
    } finally {
      setLoading(false)
    }
  }

  const errClass = errMsg ? "errmsg" : "offscreen"

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      
      {/* Error Message */}
      {errMsg && (
        <p
          ref={errRef}
          className={errClass}
          aria-live="assertive"
          style={{
            background: "#ff4d4f",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "8px",
            fontWeight: "bold"
          }}
        >
          {errMsg}
        </p>
      )}

      {/* Chat Box */}
      <div
        className="chat-box"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          background: dark ? "#121212" : "#f8f9fa",
          borderRadius: "10px",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0"
            }}
          >
            {msg.isLink ? (
              <a
                href={msg.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#28a745",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  transition: "0.2s"
                }}
              >
                {msg.label || "Open Link"}
              </a>
            ) : (
              <span
                style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "#007bff" : (dark ? "#2c2c2e" : "#e5e5ea"),
                  color: msg.role === "user" ? "white" : (dark ? "#f1f1f1" : "black"),
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.text}    
              </span>
            )}
          </div>
        ))}

        {loading && (
          <p style={{ color: "gray", fontStyle: "italic" }}>🤖 AI is thinking...</p>
        )}
      </div>

      {/* Input + Button */}
      <div style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Type your symptoms..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid gray",
            outline: "none",
            background: dark ? "#2a2a2a" : "white",
            color: dark ? "white" : "black"
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "10px 10px",
            height: 'fit-content',
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "0.2s"
          }}
        >
          {loading ? "..." : "↑"}
        </button>
      </div>
    </div>
  )
}

export default AIassistant
