import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  User as UserIcon, 
  Send, 
  ThumbsUp, 
  Building2, 
  ShieldCheck,
  TrendingUp,
  Filter,
  Lock,
  LogIn
} from 'lucide-react';
import { User } from '../types/growth';

export interface CustomerReview {
  id: string;
  authorName: string;
  companyOrRole: string;
  rating: number; // 1 to 5
  comment: string;
  suggestion?: string;
  isVerifiedBuyer: boolean;
  campaignTypeUsed: string;
  createdAt: string;
  likesCount: number;
}

interface CustomerReviewsSectionProps {
  currentUser: User | null;
  onOpenAuthModal?: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  currentUser,
  onOpenAuthModal,
}) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [filterRating, setFilterRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [companyOrRole, setCompanyOrRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [campaignTypeUsed, setCampaignTypeUsed] = useState('Venta de Planes High-Ticket');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim() || currentUser?.name || 'Cliente Verificado',
          companyOrRole: companyOrRole.trim() || 'Empresario Digital',
          rating,
          comment: comment.trim(),
          suggestion: suggestion.trim() || undefined,
          campaignTypeUsed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Sync with Marketing Interno feedback system (triggers admin alert if rating < 4 or dissatisfaction)
        try {
          await fetch('/api/marketing/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientEmail: currentUser?.email || 'cliente@empresa.com',
              clientName: authorName.trim() || currentUser?.name || 'Cliente Verificado',
              ratingStars: rating,
              message: `${comment.trim()} ${suggestion ? `(Sugerencia: ${suggestion.trim()})` : ''}`.trim(),
            }),
          });
        } catch {}

        setSubmitSuccess(true);
        setComment('');
        setSuggestion('');
        await fetchReviews();
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = filterRating > 0 
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-black border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparencia y Opiniones Reales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reseñas, Calificaciones y Sugerencias de Clientes
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Descubre los resultados obtenidos por fundadores, agencias y empresas que utilizan los motores autónomos de KaSe para captar clientes B2B. ¡Deja tu propia valoración o sugerencia para ayudarnos a seguir mejorando!
            </p>
          </div>

          {/* Average Rating Scorecard */}
          <div className="p-5 rounded-2xl bg-black/60 border border-neutral-700/80 text-center space-y-1.5 shrink-0 min-w-[200px]">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center justify-center gap-1">
              <span>{averageRating}</span>
              <span className="text-sm text-neutral-400">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Basado en {reviews.length} reseñas verificadas
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold pt-1 border-t border-neutral-800">
              ✓ 100% de Metas Cumplidas a Tiempo
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left/Top + List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form to submit a new review */}
        {/* Left Column: Form to submit a new review or Lock Card */}
        <div className="lg:col-span-5 space-y-4">
          {!currentUser ? (
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4 text-center sticky top-20">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Inicia Sesión para Dejar tu Reseña</h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                  Para garantizar opiniones 100% auténticas y verificar los resultados de la comunidad, debes iniciar sesión antes de calificar o sugerir mejoras.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión o Crear Cuenta Gratis</span>
                </button>
              </div>

              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-800 font-mono">
                ⚡ Registro libre y gratuito en 10 segundos
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl space-y-4 sticky top-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Dejar una Reseña o Sugerencia</h3>
                  <p className="text-[11px] text-neutral-400">Sesión activa como: <strong className="text-white">{currentUser.name}</strong></p>
                </div>
              </div>

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Muchas gracias por tu reseña! Ha sido publicada con éxito.</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tu Calificación General *
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="p-1 text-neutral-600 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-neutral-300 font-mono ml-2">
                      {rating} de 5 Estrellas
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ej: Kathy Seba o Ignacio M."
                      className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Empresa, Cargo o Nicho *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyOrRole}
                      onChange={(e) => setCompanyOrRole(e.target.value)}
                      placeholder="Ej: CEO en FinTech / E-commerce"
                      className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tipo de Campaña que probaste o te interesa
                  </label>
                  <select
                    value={campaignTypeUsed}
                    onChange={(e) => setCampaignTypeUsed(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Venta de Planes High-Ticket">Venta de Planes High-Ticket</option>
                    <option value="Registros de Usuarios B2B">Registros de Usuarios B2B</option>
                    <option value="Seguidores en Redes Ejecutivas">Seguidores en Redes Ejecutivas</option>
                    <option value="Likes & Engagement Orgánico">Likes & Engagement Orgánico</option>
                    <option value="Comentarios & Reseñas Calificadas">Comentarios & Reseñas Calificadas</option>
                    <option value="Vistas & Suscriptores en YouTube">Vistas & Suscriptores en YouTube</option>
                    <option value="Auto-Promoción de KaSe">Auto-Promoción de KaSe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tu Opinión o Reseña sobre KaSe *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos tu experiencia, resultados conseguidos o qué te pareció la automatización de motores..."
                    className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Sugerencia de Mejora (Opcional)
                  </label>
                  <input
                    type="text"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="¿Qué nueva funcionalidad te gustaría que agreguemos?"
                    className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-lg transition-all glow-emerald flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publicando...' : 'Publicar mi Reseña'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: List of Reviews with Filters */}
        <div className="lg:col-span-7 space-y-4">
          {/* Rating Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar por estrellas:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFilterRating(0)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterRating === 0
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white bg-black/40'
                }`}
              >
                Todas ({reviews.length})
              </button>
              {[5, 4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setFilterRating(stars)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterRating === stars
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-neutral-400 hover:text-white bg-black/40'
                  }`}
                >
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {isLoading ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Cargando opiniones de clientes...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 border border-neutral-800 rounded-2xl bg-neutral-900/40">
              No hay reseñas para este filtro. ¡Sé el primero en calificar!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-white font-bold text-sm">
                        {(rev.authorName || 'C').charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-white">{rev.authorName}</h2>
                          {rev.isVerifiedBuyer && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Cliente Verificado</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-neutral-500" />
                          <span>{rev.companyOrRole}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400">{rev.campaignTypeUsed}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-neutral-800/80">
                    "{rev.comment}"
                  </p>

                  {rev.suggestion && (
                    <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Sugerencia aportada:</strong> {rev.suggestion}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.likesCount} útil</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
