#ifndef DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
#define DIALOGSYSTEMTROOPREACTIONCONDITIONS_H

#include <QDialog>

namespace Ui {
class DialogSystemTroopReactionConditions;
}

class DialogSystemTroopReactionConditions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemTroopReactionConditions(QWidget *parent = nullptr);
    ~DialogSystemTroopReactionConditions();

private:
    Ui::DialogSystemTroopReactionConditions *ui;
};

#endif // DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
