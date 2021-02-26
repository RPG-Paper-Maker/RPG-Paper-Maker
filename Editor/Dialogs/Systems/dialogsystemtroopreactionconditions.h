#ifndef DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
#define DIALOGSYSTEMTROOPREACTIONCONDITIONS_H

#include <QDialog>
#include "systemtroopreactionconditions.h"

namespace Ui {
class DialogSystemTroopReactionConditions;
}

class DialogSystemTroopReactionConditions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemTroopReactionConditions(SystemTroopReactionConditions
        &conditions, QWidget *parent = nullptr);
    ~DialogSystemTroopReactionConditions();

private:
    Ui::DialogSystemTroopReactionConditions *ui;
    SystemTroopReactionConditions &m_conditions;
};

#endif // DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
