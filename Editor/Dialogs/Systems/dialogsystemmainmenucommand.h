#ifndef DIALOGSYSTEMMAINMENUCOMMAND_H
#define DIALOGSYSTEMMAINMENUCOMMAND_H

#include <QDialog>
#include "systemmainmenucommand.h"

namespace Ui {
class DialogSystemMainMenuCommand;
}

class DialogSystemMainMenuCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemMainMenuCommand(SystemMainMenuCommand &mainMenuCommand,
        QWidget *parent = nullptr);
    ~DialogSystemMainMenuCommand();

    void initialize();
    void translate();
    void setVisibleScript(bool b);

private:
    Ui::DialogSystemMainMenuCommand *ui;
    SystemMainMenuCommand &m_mainMenuCommand;

public slots:
    void on_comboBoxKind_currentIndexChanged(int index);
    void on_plainTextScript_textChanged();
};

#endif // DIALOGSYSTEMMAINMENUCOMMAND_H
