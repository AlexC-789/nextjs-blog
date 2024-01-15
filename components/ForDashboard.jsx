"use client";
import { useState } from "react";
import { questionsForm } from "@/lib/questions";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

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
    const [finalDecisions, setFinalDecisions] = useState([]);
    const [error, setError] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [domain, setDomain] = useState("");
    const [imgPath, setImgPath] = useState("");
    const {data: session} = useSession();

    const handleCheckboxes = (value) => {
        if (finalDecisions.includes(value)) {
            setFinalDecisions(finalDecisions.filter((box) => box !== value));
            setError("");
        } else if (finalDecisions.length < 5) {
            setFinalDecisions([...finalDecisions, value]);
            setError();
        } else {
            setError("Trebuie să alegeți numai 5 hobby-uri.");
        }
    }

    const handleSubmit = async (e) => {
        if (isBusy) {
            setError("Trimiterea formularului este în proces.");
            return;
        }

        setIsBusy(true);
        e.preventDefault();

        if (finalDecisions.length !== 5) {
            setError("Trebuie să alegeți numai 5 hobby-uri.");
            return;
        }

        finalDecisions.sort();

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
                  chosenHobbies: finalDecisions
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
        } finally {
            setIsBusy(false);
        }
    }
    return (
        <form className="m-2" onSubmit={handleSubmit}>
            <p>Deoarece nu v-ați selectat un hobby, completați acest formular pentru a înțelege ce vă place.</p>
            <p>{questionsForm["question"]}</p>
            {["Da", "Nu"].map((affirmation) => {
                return (
                    <label className="m-4" key={affirmation} htmlFor={`affirmation_${affirmation}`}>
                        <input className="mr-2" type="radio" id={`affirmation_${affirmation}`} name="yesOrNo" onChange={(e) => {
                            if (e.target.checked) {
                                setAffirmationDict(questionsForm["answers"][affirmation]);
                                setHobbyDict({});
                                setDomain("");
                                setImgPath(`/images/hobby_images/${affirmation}`)
                                if (!isBusy) {
                                    setFinalDecisions([]);
                                }
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
                                    if (!isBusy) {
                                        setFinalDecisions([]);
                                    }
                                    setDomain(key);
                                    setError("");
                                }
                            }}></input>
                            {key} 
                        </label>
                    )
                    }
                )}

                {error && (
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                    {error}
                    </div>
                )}

                {Object.keys(hobbyDict).length !== 0 &&
                <>
                <p>{hobbyDict["question"]}</p>
                    {hobbyDict["finalAnswers"].map((key) => {
                        return (
                            <div className="m-4 relative inline-block" key={`hobbySelection_${key}`}>
                                <Image src={`${imgPath}/${encodeURIComponent(domain)}/${encodeURIComponent(key)}.png`} width={150} height={150} alt={key}/>
                                <label key={key} htmlFor={`hobbySelection_${key}`}>
                                    <input className="mr-2"
                                    type="checkbox"
                                    checked={finalDecisions.includes(key)}
                                    id={`hobbySelection_${key}`} name="hobbySelection" onChange={() => {handleCheckboxes(key)}
                                    /*(e) => {
                                        if (isBusy) {
                                            return;
                                        }
                                        setIsBusy(true);
                                        
                                        if (e.target.checked) {
                                            if (finalDecisions.length >= 5) {
                                                setError("Trebuie să alegeți numai 5 hobby-uri.")
                                                e.target.checked = false;
                                            } else {
                                                finalDecisions.push(key);
                                                setError("");
                                            }
                                        } else {
                                            finalDecisions = finalDecisions.filter((el) => el !== key);
                                        }
                                        //console.log(finalDecisions);
                                        setIsBusy(false); */
                                        }></input>
                                    {key}
                                </label>
                            </div>
                        )
                        }
                    )}
                <br /> 
                <button disabled={isBusy} className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
                    Trimite formularul
                </button>
                <p>După apăsarea butonului de sus și confirmarea schimbărilor în baza de date, veți fi nevoit(ă) să reintrați în contul vostru.</p>
                </>}
                </>
            }
        </form>
    )
}

export {Dropdown, Questions}