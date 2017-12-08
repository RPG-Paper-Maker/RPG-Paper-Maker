/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
