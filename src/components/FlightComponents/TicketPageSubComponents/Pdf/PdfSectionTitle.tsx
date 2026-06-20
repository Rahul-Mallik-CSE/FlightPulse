import { Text, View } from '@react-pdf/renderer'
import { ticketPdfStyles } from './ticketPdfStyles'

type PdfSectionTitleProps = {
  title: string
  subtitle?: string
}

export default function PdfSectionTitle({ title, subtitle }: PdfSectionTitleProps) {
  return (
    <View style={ticketPdfStyles.section}>
      <Text style={ticketPdfStyles.title}>{title}</Text>
      {subtitle ? <Text style={ticketPdfStyles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}
