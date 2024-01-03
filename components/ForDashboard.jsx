"use client";
import { useState } from "react";
import { questionsForm } from "@/lib/questions";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function Dropdown() {
    const hobbies = ['Artă', 'Muzică', 'Știință', 'Filozofie', 'Sport'];
    const [selectedHobby, setSelectedHobby] = useState("");
    
    return (
        <div>
        <label htmlFor="hobbies">Alegeți-vă un hobby:</label>
        <select id="hobbies" value={selectedHobby} onChange={(e) => {setSelectedHobby(e.target.value)}}>
            <option value="">-- Alege --</option>
            {hobbies.map((hobby) => (
            <option key={hobby} value={hobby}>
                {hobby}
            </option>
            ))}
        </select>
        {selectedHobby && <p>Ați ales: {selectedHobby}</p>}
        </div>
    );
}

function Questions() {

    const [affirmationDict, setAffirmationDict] = useState({});
    const [hobbyDict, setHobbyDict] = useState({});
    const [finalDecision, setFinalDecision] = useState("");
    const [error, setError] = useState("");
    const {data: session} = useSession();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!finalDecision) {
            setError("Nu a fost ales un răspuns la ultima întrebare.");
            return;
        }

        try {
            const res = await fetch("api/changeHobbyStatus", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: session?.user?.name,
                  surname: session?.user?.surname,
                  email: session?.user?.email,
                  chosenHobby: finalDecision
                }),
              });

            if (res.ok) {
                const form = e.target;
                form.reset();
                setAffirmationDict({});
                setHobbyDict({});
                signOut({callbackUrl: '/'});
            } else {
                setError("Trimiterea formularului a eșuat.")
            }
        } catch(error) {
            console.log(error)
        }
    }
    return (
        <form className="m-2" onSubmit={handleSubmit}>
            <p>{questionsForm["question"]}</p>
            {["Da", "Nu"].map((affirmation) => {
                return (
                    <label className="m-4" key={affirmation} htmlFor={`affirmation_${affirmation}`}>
                        <input className="mr-2" type="radio" id={`affirmation_${affirmation}`} name="yesOrNo" onChange={(e) => {
                            if (e.target.checked) {
                                setAffirmationDict(questionsForm["answers"][affirmation]);
                                setHobbyDict({});
                                setFinalDecision("");
                                setError("");
                            }
                        }}></input>
                        {affirmation}
                    </label>
                )
            })}

            {Object.keys(affirmationDict).length !== 0 && 
                <>
                <p>{affirmationDict["question"]}</p>
                {Object.keys(affirmationDict["answers"]).map((key) => {
                    return (
                        <label className="m-4" key={key} htmlFor={`domainSelection_${key}`}>
                            <input className="mr-2" 
                            type="radio" 
                            id={`domainSelection_${key}`} name="domainSelection" onChange={(e) => {
                                if (e.target.checked) {
                                    setHobbyDict(affirmationDict["answers"][key]);
                                    setFinalDecision("");
                                    setError("");
                                }
                            }}></input>
                            {key} 
                        </label>
                    )
                    }
                )}

                {Object.keys(hobbyDict).length !== 0 &&
                <>
                <p>{hobbyDict["question"]}</p>
                    {hobbyDict["finalAnswers"].map((key) => {
                        return (
                            <label className="m-4" key={key} htmlFor={`hobbySelection_${key}`}>
                                <input className="mr-2"
                                type="radio" 
                                id={`hobbySelection_${key}`} name="hobbySelection" onChange={(e) => {
                                    if (e.target.checked) {
                                        setFinalDecision(key);
                                        setError("");
                                    }
                                }}></input>
                                {key} 
                            </label>
                        )
                        }
                    )}
                <br /> 
                <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
                    Trimite formularul
                </button>
                </>}
                </>
            }

        {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
    )
}

export {Dropdown, Questions}