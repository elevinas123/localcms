import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useEffect, useState } from "react"
import BlogTableElement from "./BlogTableElement"


export default function BlogTable (props) {

  const [tableContents, setTableContents] = useState([])

  useEffect(() => {
    console.log(props.blogContent)
    if (props.blogContent.contents) {
      setTableContents(props.blogContent.contents.map((i, index) => <BlogTableElement key={index} sellectBlog={props.sellectBlog} {...i} />))
    }
  }, [props.blogContent])


  return (
    <div className="flex flex-col bg-slate-300 ">
      <Table>
        <TableCaption>All your blogs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>DateCreated</TableHead>
          </TableRow>
        </TableHeader>
        {tableContents}
        
      </Table>
    </div>
  )
}