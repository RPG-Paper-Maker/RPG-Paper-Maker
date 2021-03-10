/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMRANDOMBATTLE_H
#define DIALOGSYSTEMRANDOMBATTLE_H

#include <QDialog>

namespace Ui {
class DialogSystemRandomBattle;
}

class DialogSystemRandomBattle : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemRandomBattle(QWidget *parent = nullptr);
    ~DialogSystemRandomBattle();

private:
    Ui::DialogSystemRandomBattle *ui;
};

#endif // DIALOGSYSTEMRANDOMBATTLE_H
