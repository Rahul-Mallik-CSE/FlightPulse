import { Text, View } from '@react-pdf/renderer'
import { StopRow } from '@/types/FlightTypes'
import { ticketPdfStyles } from './ticketPdfStyles'

type PdfStopRowProps = {
  row: StopRow
}

export default function PdfStopRow({ row }: PdfStopRowProps) {
  return (
    <View style={[ticketPdfStyles.row, ticketPdfStyles.rowMuted]}>
      <View style={[ticketPdfStyles.tableCell, { width: '24%' }]}>
        <Text style={ticketPdfStyles.stopBadge}>One Stop</Text>
      </View>

      <View style={[ticketPdfStyles.tableCell, { width: '48%', borderRightWidth: 1 }]}> 
        <Text style={ticketPdfStyles.stopTitle}>Layovers & Connecting Flights For {row.stopCity}</Text>
        <Text style={ticketPdfStyles.stopText}>{row.stopAirport}</Text>
      </View>

      <View style={[ticketPdfStyles.tableCell, { width: '16%', borderRightWidth: 0 }]}>
        <Text style={ticketPdfStyles.city}>{row.layover}</Text>
      </View>
    </View>
  )
}
