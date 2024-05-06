import { MouseEvent, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import TableHead from './TableHead'
import TableToolbar from './TableToolbar'
import { Row } from '../../db/model'

interface TableProps { rows: Row[], setRows: (r: Row[]) => void, searchQuery: string }
type SortOrder = 'desc' | 'asc'

const filterableFields: (keyof Row)[] = ['name', 'email']

const Table = ({ rows, setRows, searchQuery }: TableProps) => {
	const [order, setOrder] = useState<SortOrder>('asc')
	const [sortBy, setSortBy] = useState<keyof Row>('name')
	const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
	const [numSelected, setNumSelected] = useState<number>(0)

	const handleRequestSort = (event: MouseEvent, property: string) => {
		if (property === sortBy) {
			setOrder(order === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(property as keyof Row)
		}
	}

	const handleSelectAllClick = () => {
		if (numSelected === rows.length) {
			setSelectedRows(new Set())
			setNumSelected(0)
		} else {
			const selectedRowsIds = rows.map((row) => row.id)
			setSelectedRows(new Set(selectedRowsIds))
			setNumSelected(rows.length)
		}
	}

	const handleClick = (event: MouseEvent, id: number) => {
		const target = event.target as HTMLInputElement
		const newSelectedIds = new Set(selectedRows)

		if (target.type === 'checkbox') {
			if (newSelectedIds.has(id)) {
				newSelectedIds.delete(id)
				setNumSelected((prev) => prev - 1)
			} else {
				newSelectedIds.add(id)
				setNumSelected((prev) => prev + 1)
			}
			setSelectedRows(newSelectedIds)
		}
	}

	const handleDelete = () => {
		const updatedRows = rows.filter((row) => !selectedRows.has(row.id))
		setRows(updatedRows)
		setSelectedRows(new Set())
		setNumSelected(0)
	}

	const stringifyRow = useCallback(
		(row: Row): string =>
			filterableFields.map((fieldName) => row[fieldName]).join(' '),
		[filterableFields]
	)

	const filterBySearchQuery = useCallback(
		(row: Row): boolean => {
			const words = searchQuery.toLowerCase().split(' ')
			const stringifiedRow = stringifyRow(row).toLowerCase()

			// eslint-disable-next-line no-restricted-syntax
			for (const word of words) {
				if (stringifiedRow.includes(word)) return true
			}

			return false
		},
		[searchQuery, stringifyRow]
	)

	const sortBySelectedOrder = useCallback(
		(rowA: Row, rowB: Row): number => {
			const rowAFieldValue = rowA[sortBy].toString()
			const rowBFieldValue = rowB[sortBy].toString()

			return rowAFieldValue.localeCompare(rowBFieldValue, undefined, { sensitivity: 'base' }) * (order === 'asc' ? 1 : -1)

		}, [order, sortBy]
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const isSelected = (id: number) => (selectedRows.has(id))

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableToolbar numSelected={numSelected} handleDelete={handleDelete} />

				<TableContainer>
					<MuiTable>
						<TableHead
							numSelected={numSelected}
							order={order}
							orderBy={sortBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{rows
								.filter(filterBySearchQuery)
								.sort(sortBySelectedOrder)
								.map((row) => {
									const isItemSelected = isSelected(row.id)

									return (
										<TableRow
											hover
											onClick={(event: MouseEvent) =>
												handleClick(event, row.id)
											}
											role="checkbox"
											tabIndex={-1}
											key={row.name}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox color="primary" />
											</TableCell>
											<TableCell component="th" scope="row" padding="none">
												{row.name}
											</TableCell>
											<TableCell align="right">{row.email}</TableCell>
											<TableCell align="right">{row.age}</TableCell>
										</TableRow>
									)
								})}
						</TableBody>
					</MuiTable>
				</TableContainer>
			</Paper>
		</Box>
	)
}

export default Table
