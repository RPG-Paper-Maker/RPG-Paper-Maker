/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_pushButtonChange_clicked();
    void on_lineEditAbbreviation_textChanged(const QString &text);
    void on_lineEditDescription_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMKEYBOARDGENERAL_H
