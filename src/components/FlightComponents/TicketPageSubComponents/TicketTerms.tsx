'use client'

export default function TicketTerms() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Terms And Conditions</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Payments</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-secondary leading-relaxed">
              <span className="text-theme font-bold shrink-0 mt-0.5">•</span>
              <span>
                If You Are Purchasing Your Ticket Using A Debit Or Credit Card Via The Website, We Will Process
                These Payments Via The Automated Secure Common Payment Gateway Which Will Be Subject To Fraud
                Screening Purposes.
              </span>
            </li>
            <li className="flex gap-3 text-sm text-secondary leading-relaxed">
              <span className="text-theme font-bold shrink-0 mt-0.5">•</span>
              <span>
                If You Do Not Supply The Correct Card Billing Address And/Or Cardholder Information, Your Booking
                Will Not Be Confirmed And The Overall Cost May Increase. We Reserve The Right To Cancel Your Booking
                If Payment Is Declined For Any Reason Or If You Have Supplied Incorrect Card Information. If We
                Become Aware Of, Or Is Notified Of, Any Fraud Or Illegal Activity Associated With The Payment For
                The Booking, The Booking Will Be Cancelled And You Will Be Liable For All Costs And Expenses Arising
                From Such Cancellation, Without Prejudice To Any Action That May Be Taken Against Us.
              </span>
            </li>
            <li className="flex gap-3 text-sm text-secondary leading-relaxed">
              <span className="text-theme font-bold shrink-0 mt-0.5">•</span>
              <span>
                EasyTravio May Require The Card Holder To Provide Additional Payment Verification Upon Request By
                Either Submitting An Online Form Or Visiting The Nearest EasyTravio Office, Or At The Airport At
                The Time Of Check-in. EasyTravio Reserves The Right To Deny Boarding Or To Collect A Guarantee
                Payment (In Cash Or From Another Credit Card) If The Card Originally Used For The Purchase Cannot
                Be Presented By The Cardholder At Check-In Or When Collecting The Tickets, Or In The Case The
                Original Payment Has Been Withheld Or Disputed By The Card Issuing Bank. Credit Card Details Are
                Held In A Secured Environment And Transferred Through An Internationally Accepted System.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Passenger Information</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-secondary leading-relaxed">
              <span className="text-theme font-bold shrink-0 mt-0.5">•</span>
              <span>
                All Passengers Must Carry Valid Government-Issued Photo Identification. International Passengers Must
                Present A Valid Passport With At Least 6 Months Validity Beyond The Intended Stay.
              </span>
            </li>
            <li className="flex gap-3 text-sm text-secondary leading-relaxed">
              <span className="text-theme font-bold shrink-0 mt-0.5">•</span>
              <span>
                Please Arrive At The Airport At Least 2 Hours Before Domestic Flights And 3 Hours Before
                International Flights. EasyTravio Is Not Responsible For Missed Flights Due To Late Arrival At
                The Airport.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
