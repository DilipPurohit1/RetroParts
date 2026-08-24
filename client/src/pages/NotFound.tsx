import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../components/common/Button.js';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 min-h-[75vh] flex flex-col justify-center text-text-primary">
      <div className="w-16 h-16 rounded-card bg-surface text-accent border border-border flex items-center justify-center mx-auto shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-display font-medium text-text-primary">404</h1>
        <h2 className="text-xl font-medium text-text-primary font-display">Off road: page not found</h2>
        <p className="text-[13px] text-text-muted max-w-sm mx-auto">
          The spare part specification, bounty request, or page you are looking for has taken a detour.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to home
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="secondary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
            Explore parts
          </Button>
        </Link>
      </div>
    </div>
  );
};
