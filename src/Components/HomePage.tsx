import { useEffect } from "react";

import { useSelector } from "react-redux";
import type { RootState } from '../Store';

export default function HomePage() {

    const tokenExpiration = useSelector((state: RootState) => state.auth.tokenExpiration ) // this is how to get



    return (
        <div>{tokenExpiration}</div>
    )

}