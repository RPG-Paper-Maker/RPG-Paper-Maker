/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMKEYBOARDGENERAL_H
#define DIALOGSYSTEMKEYBOARDGENERAL_H

#include "dialogsystemkeyboard.h"

namespace Ui {
class DialogSystemKeyBoardGeneral;
}

class DialogSystemKeyBoardGeneral : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemKeyBoardGeneral(SystemKeyBoard& key,
                                         QWidget *parent = 0);
    ~DialogSystemKeyBoardGeneral();
    SystemKeyBoard& key() const;

private:
    Ui::DialogSystemKeyBoardGeneral *ui;
    SystemKeyBoard& m_key;

    void initialize();
    void translate();

private slots:
    void on_pushButtonChange_clicked();
    void on_lineEditAbbreviation_textChanged(const QString &text);
    void on_lineEditDescription_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMKEYBOARDGENERAL_H
