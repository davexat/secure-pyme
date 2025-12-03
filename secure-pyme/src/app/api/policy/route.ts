const policyState = {
    permitirInstalacion: false,
}

export default function handler(req, res){
    if (req.method === "GET") {
        res.status(200).json(policyState)
    } else if (req.method === "POST") {
        const { allowInstall } = req.body
        policyState.permitirInstalacion = !!allowInstall
        res.status(200).json(policyState)
    } else {
        res.status(405).end()
    }
}