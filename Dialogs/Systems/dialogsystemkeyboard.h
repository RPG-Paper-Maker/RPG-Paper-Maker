/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
