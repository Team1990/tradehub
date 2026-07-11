import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as productsApi, reviews as reviewsApi, inquiries as inquiriesApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';
import type { Product, Review } from '../types';
import { Card, Button, Badge, StarRating } from '../components/ui';
import { Package, Building2, MapPin, ChevronRight, Send } from 'lucide-react';

export function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inqQty, setInqQty] = useState(1);
  const [inqMsg, setInqMsg] = useState('');
  const [inqSent, setInqSent] = useState(false);
  const [inqLoading, setInqLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      productsApi.get(id),
      reviewsApi.list(id),
    ]).then(([p, r]) => {
      setProduct(p.data.data);
      setReviews(r.data.data.reviews);
      setAvgRating(r.data.data.average);
      setReviewTotal(r.data.data.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const sendInquiry = async () => {
    if (!product || !user) return;
    setInqLoading(true);
    try {
      await inquiriesApi.create({ productId: product.id, quantity: inqQty, message: inqMsg });
      setInqSent(true);
    } catch { } finally {
      setInqLoading(false);
    }
  };

  const submitReview = async () => {
    if (!product || !user) return;
    try {
      await reviewsApi.create(product.id, { rating: reviewRating, comment: reviewComment });
      const r = await reviewsApi.list(product.id);
      setReviews(r.data.data.reviews);
      setAvgRating(r.data.data.average);
      setReviewTotal(r.data.data.total);
      setReviewComment('');
    } catch { }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><Card className="h-96 animate-pulse" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            {product.images?.[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Package className="w-24 h-24 text-gray-300" /></div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'border-brand-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-gray-500">({reviewTotal} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-600">₹{product.price.toLocaleString()}</span>
            <span className="text-gray-500">per {product.unit}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {product.company?.city}, {product.company?.state}
            {product.company?.isVerified && <Badge variant="success">Verified</Badge>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{product.company?.name}</span>
          </div>

          <div className="text-sm text-gray-500">
            Minimum Order: <strong className="text-gray-700">{product.minOrderQty} {product.unit}(s)</strong>
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          {user && user.role === 'BUYER' && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Send Inquiry</h3>
              {inqSent ? (
                <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Inquiry sent! The seller will contact you.</p>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({product.unit})</label>
                    <input type="number" min={product.minOrderQty} value={inqQty} onChange={(e) => setInqQty(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                    <textarea value={inqMsg} onChange={(e) => setInqMsg(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="I'm interested in your product..." />
                  </div>
                  <Button onClick={sendInquiry} loading={inqLoading} className="w-full"><Send className="w-4 h-4 mr-2" /> Send Inquiry</Button>
                </>
              )}
            </Card>
          )}

          {!user && (
            <Card className="p-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Sign in to send inquiry</p>
              <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Reviews & Ratings</h2>

        {user && user.role === 'BUYER' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-sm">Write a Review</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewRating(s)}>
                  <StarRating rating={s <= reviewRating ? s : 0} />
                </button>
              ))}
            </div>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Share your experience..." />
            <Button size="sm" onClick={submitReview}>Submit Review</Button>
          </Card>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    {review.reviewer?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.reviewer?.name}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600 ml-11">{review.comment}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
