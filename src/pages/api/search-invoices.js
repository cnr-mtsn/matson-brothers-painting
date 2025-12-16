import { graphqlRequest } from '@/utils/graphql';

const SEARCH_INVOICES_QUERY = `
  query SearchInvoices($invoiceNumber: String, $email: String, $name: String) {
    searchInvoices(invoiceNumber: $invoiceNumber, email: $email, name: $name) {
      id
      invoice_number
      title
      total
      status
      due_date
      created_at
      customer {
        id
        name
        email
      }
    }
  }
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { invoiceNumber, email, name } = req.body;

    const fieldsProvided = [invoiceNumber, email, name].filter(Boolean).length;
    if (fieldsProvided === 0) {
      return res.status(400).json({
        message: 'Please provide at least one search criteria',
      });
    }
    if (fieldsProvided > 1) {
      return res.status(400).json({
        message: 'Please search by only ONE field',
      });
    }

    const data = await graphqlRequest(SEARCH_INVOICES_QUERY, {
      invoiceNumber,
      email,
      name,
    });

    // Transform to match current QuickBooks API format
    const invoices = data.searchInvoices.map(invoice => {
      // Format dates properly (convert from timestamp to YYYY-MM-DD format)
      const formatDate = (dateValue) => {
        if (!dateValue) return null;

        // If it's a timestamp string (all digits), convert to date
        if (typeof dateValue === 'string' && /^\d+$/.test(dateValue)) {
          const timestamp = parseInt(dateValue);
          const date = new Date(timestamp);
          return date.toISOString().split('T')[0];
        }

        // If it's already a date string, extract just the date part
        if (typeof dateValue === 'string') {
          return dateValue.split('T')[0];
        }

        return dateValue;
      };

      return {
        id: invoice.id,
        docNumber: invoice.invoice_number,
        txnDate: formatDate(invoice.created_at),
        dueDate: formatDate(invoice.due_date),
        balance: invoice.total,
        totalAmt: invoice.total,
        customerId: invoice.customer?.id,
        customerName: invoice.customer?.name || 'Unknown',
        customerEmail: invoice.customer?.email || '',
        isPaid: false,
        paymentInfo: null,
      };
    });

    return res.status(200).json({
      message: 'Invoices found successfully',
      invoices,
    });
  } catch (error) {
    console.error('Error searching invoices:', error);
    return res.status(500).json({
      message: error.message || 'Error searching for invoices',
    });
  }
}
