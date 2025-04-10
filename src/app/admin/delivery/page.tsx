'use client'

import { useEffect, useState } from "react"
import { toast } from "sonner"

const Page = () => {
    const [data, setData] = useState([])
    
    const fetchDeliveries = async() => {
        const response = await fetch("/api/admin/delivery", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!response.ok){
            toast('Алдаа гарлаа!')
        }
        const jsonData = await response.json()
        setData(jsonData)
        console.log(data)
    }

    useEffect(() => {
        fetchDeliveries()
    }, [])

    return(
        <div>
            {data?.map((prop) => (
                <div key={prop.id}>
                    {prop.id}
                </div>
            ))}
        </div>
    )
}

export default Page