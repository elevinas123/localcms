import { useEffect } from "react"
import { TableBody, TableCell, TableRow } from "./ui/table"



export default function BlogTableElement (props) {

    

    return(
        <TableBody className="cursor-pointer" onClick={() => props.sellectBlog(props)}>
          <TableRow>
            <TableCell className="font-medium">{"labas"}</TableCell>
            <TableCell>2006-05-20</TableCell>
          </TableRow>
        </TableBody>
    )
}