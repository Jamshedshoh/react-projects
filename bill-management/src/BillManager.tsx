import { useState, useEffect } from 'react';
import { Plus, Check, Clock, AlertTriangle, DollarSign, Calendar, Trash2, Edit2, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

type BillStatus = 'paid' | 'pending' | 'overdue';
type BillCategory = 'utilities' | 'rent' | 'subscriptions' | 'insurance' | 'other';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: BillCategory;
  status: BillStatus;
  paidDate?: string;
  notes?: string;
}

const BillManager = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [newBill, setNewBill] = useState<Omit<Bill, 'id'>>({ 
    name: '', 
    amount: 0, 
    dueDate: '', 
    category: 'utilities', 
    status: 'pending' 
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBillId, setEditBillId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<BillStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<BillCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [totalPending, setTotalPending] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  // Load bills from localStorage
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    } else {
      // Sample initial data
      setBills([
        {
          id: '1',
          name: 'Electricity',
          amount: 85.50,
          dueDate: '2023-06-15',
          category: 'utilities',
          status: 'paid',
          paidDate: '2023-06-10'
        },
        {
          id: '2',
          name: 'Internet',
          amount: 59.99,
          dueDate: '2023-06-20',
          category: 'subscriptions',
          status: 'pending'
        },
        {
          id: '3',
          name: 'Rent',
          amount: 1200.00,
          dueDate: '2023-06-01',
          category: 'rent',
          status: 'paid',
          paidDate: '2023-05-28'
        }
      ]);
    }
  }, []);

  // Save bills to localStorage
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
    
    // Calculate totals
    const pending = bills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.amount, 0);
    const paid = bills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    setTotalPending(pending);
    setTotalPaid(paid);
  }, [bills]);

  const addBill = () => {
    if (!newBill.name || !newBill.dueDate) return;
    
    const bill: Bill = {
      ...newBill,
      id: Date.now().toString(),
    };
    
    setBills([...bills, bill]);
    setNewBill({ name: '', amount: 0, dueDate: '', category: 'utilities', status: 'pending' });
    setShowAddForm(false);
  };

  const updateBill = () => {
    if (!editBillId || !newBill.name || !newBill.dueDate) return;
    
    setBills(bills.map(bill => 
      bill.id === editBillId ? { ...bill, ...newBill } : bill
    ));
    setEditBillId(null);
    setNewBill({ name: '', amount: 0, dueDate: '', category: 'utilities', status: 'pending' });
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(bill => bill.id !== id));
  };

  const markAsPaid = (id: string) => {
    setBills(bills.map(bill => 
      bill.id === id 
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } 
        : bill
    ));
  };

  const startEdit = (bill: Bill) => {
    setEditBillId(bill.id);
    setNewBill({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category,
      status: bill.status
    });
  };

  const cancelEdit = () => {
    setEditBillId(null);
    setNewBill({ name: '', amount: 0, dueDate: '', category: 'utilities', status: 'pending' });
  };

  const filteredBills = bills.filter(bill => {
    const statusMatch = filterStatus === 'all' || bill.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || bill.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const getStatusIcon = (status: BillStatus) => {
    switch (status) {
      case 'paid': return <Check className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getCategoryIcon = (category: BillCategory) => {
    switch (category) {
      case 'utilities': return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'rent': return <DollarSign className="h-4 w-4 text-purple-500" />;
      case 'subscriptions': return <DollarSign className="h-4 w-4 text-indigo-500" />;
      case 'insurance': return <DollarSign className="h-4 w-4 text-teal-500" />;
      case 'other': return <DollarSign className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Bill Management</h1>
        <p className="text-center text-gray-600 mb-8">Track and manage your monthly expenses</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Total Bills</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{bills.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-2">${totalPending.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Paid This Month</h3>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">${totalPaid.toFixed(2)}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <button
            onClick={() => {
              setShowAddForm(true);
              cancelEdit();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" /> Add Bill
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
            >
              <Filter className="h-5 w-5 mr-1" /> Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as BillStatus | 'all')}
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as BillCategory | 'all')}
                >
                  <option value="all">All Categories</option>
                  <option value="utilities">Utilities</option>
                  <option value="rent">Rent/Mortgage</option>
                  <option value="subscriptions">Subscriptions</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editBillId) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editBillId ? 'Edit Bill' : 'Add New Bill'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBill.name}
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  placeholder="e.g., Electricity Bill"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBill.amount || ''}
                  onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBill.category}
                  onChange={(e) => setNewBill({...newBill, category: e.target.value as BillCategory})}
                >
                  <option value="utilities">Utilities</option>
                  <option value="rent">Rent/Mortgage</option>
                  <option value="subscriptions">Subscriptions</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBill.status}
                  onChange={(e) => setNewBill({...newBill, status: e.target.value as BillStatus})}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={editBillId ? updateBill : addBill}
                disabled={!newBill.name || !newBill.dueDate}
                className={`px-4 py-2 rounded-md flex items-center ${
                  !newBill.name || !newBill.dueDate
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Check className="h-5 w-5 mr-1" /> {editBillId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => editBillId ? cancelEdit() : setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
              >
                <X className="h-5 w-5 mr-1" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bills List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredBills.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className={bill.status === 'overdue' ? 'bg-red-50' : bill.status === 'paid' ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{bill.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${bill.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-gray-900">{new Date(bill.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(bill.category)}
                        <span className="ml-1 capitalize">{bill.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(bill.status)}
                        <span className="ml-1 capitalize">{bill.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {bill.status !== 'paid' && (
                          <button
                            onClick={() => markAsPaid(bill.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as paid"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(bill)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No bills found matching your filters</p>
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                }}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillManager;