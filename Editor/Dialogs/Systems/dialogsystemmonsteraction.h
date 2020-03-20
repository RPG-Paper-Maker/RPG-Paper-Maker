#ifndef DIALOGSYSTEMMONSTERACTION_H
#define DIALOGSYSTEMMONSTERACTION_H

#include <QDialog>
#include "systemmonsteraction.h"

namespace Ui {
class DialogSystemMonsterAction;
}

class DialogSystemMonsterAction : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemMonsterAction(SystemMonsterAction &action, QWidget
        *parent = nullptr);
    ~DialogSystemMonsterAction();

private:
    Ui::DialogSystemMonsterAction *ui;
    SystemMonsterAction &m_monsterAction;

    void initialize();
    void translate();

public slots:
    void on_radioButtonUseItemID_toggled(bool checked);
    void on_radioButtonUseSkillID_toggled(bool checked);
    void on_checkBoxScript_toggled(bool checked);
    void on_checkBoxStatisticID_toggled(bool checked);
    void on_checkBoxTurnValueIs_toggled(bool checked);
    void on_checkBoxVariableValue_toggled(bool checked);
    void on_checkBoxIsUnderEffectOfStatus_toggled(bool checked);
};

#endif // DIALOGSYSTEMMONSTERACTION_H
