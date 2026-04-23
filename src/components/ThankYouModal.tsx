import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flower2, CheckCircle2 } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
  total: string;
};

export function ThankYouModal({ open, onClose, orderNumber, total }: Props) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md text-center bg-gradient-romantic border-accent/40">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <Flower2 className="h-16 w-16 text-primary animate-float" />
            <CheckCircle2 className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-background rounded-full" />
          </div>
          <DialogTitle className="font-display text-3xl text-primary">
            {t("thanks.title")}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 leading-relaxed">
            <Trans i18nKey="thanks.desc" components={[<strong key="0" />]} />
          </DialogDescription>

          <div className="w-full bg-card/80 rounded-xl p-4 text-sm space-y-1 mt-2">
            <p className="text-muted-foreground">{t("thanks.orderNumber")}</p>
            <p className="font-display text-xl text-primary">#{orderNumber}</p>
            <p className="text-muted-foreground mt-2">{t("thanks.total")}</p>
            <p className="font-semibold text-foreground">{total}</p>
          </div>

          <Button onClick={onClose} className="rounded-full mt-2 px-8">
            {t("thanks.continue")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
