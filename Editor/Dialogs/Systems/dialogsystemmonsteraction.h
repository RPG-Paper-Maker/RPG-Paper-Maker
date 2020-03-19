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
};

#endif // DIALOGSYSTEMMONSTERACTION_H
