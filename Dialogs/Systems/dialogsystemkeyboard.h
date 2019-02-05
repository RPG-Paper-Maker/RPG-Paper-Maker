/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef DIALOGSYSTEMKEYBOARD_H
#define DIALOGSYSTEMKEYBOARD_H

#include <QDialog>
#include <QKeyEvent>
#include "systemkeyboard.h"

namespace Ui {
class DialogSystemKeyBoard;
}

class DialogSystemKeyBoard : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemKeyBoard(SystemKeyBoard& key, QWidget *parent = 0);
    ~DialogSystemKeyBoard();
    SystemKeyBoard& key() const;
    void updateLabel(bool wait = true);

private:
    Ui::DialogSystemKeyBoard *ui;
    SystemKeyBoard& m_key;
    QSet<int> m_keysPressed;
    QVector<int> m_currentShortcut;
    void initialize();

private slots:
    void on_pushButtonRemoveLast_clicked();
    void on_pushButtonRemoveAll_clicked();
    void keyPressEvent(QKeyEvent* event);
    void keyReleaseEvent(QKeyEvent* event);
};

#endif // DIALOGSYSTEMKEYBOARD_H
