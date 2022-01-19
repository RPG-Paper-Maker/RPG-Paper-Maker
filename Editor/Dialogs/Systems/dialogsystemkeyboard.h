/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

private slots:
    void on_pushButtonRemoveLast_clicked();
    void on_pushButtonRemoveAll_clicked();
    void keyPressEvent(QKeyEvent* event);
    void keyReleaseEvent(QKeyEvent* event);
};

#endif // DIALOGSYSTEMKEYBOARD_H
