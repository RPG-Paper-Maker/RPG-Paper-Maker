#ifndef PANELTROOPREACTION_H
#define PANELTROOPREACTION_H

#include <QWidget>

namespace Ui {
class PanelTroopReaction;
}

class PanelTroopReaction : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTroopReaction(QWidget *parent = nullptr);
    ~PanelTroopReaction();

private:
    Ui::PanelTroopReaction *ui;
};

#endif // PANELTROOPREACTION_H
