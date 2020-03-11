/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGANIMATIONCREATETRANSITION_H
#define DIALOGANIMATIONCREATETRANSITION_H

#include <QDialog>
#include "systemanimation.h"

// -------------------------------------------------------
//
//  CLASS DialogAnimationCreateTransition
//
//  A dialog used for transitions in animations.
//
// -------------------------------------------------------

namespace Ui {
class DialogAnimationCreateTransition;
}

class DialogAnimationCreateTransition : public QDialog
{
    Q_OBJECT

public:
    explicit DialogAnimationCreateTransition(QWidget *parent = nullptr);
    ~DialogAnimationCreateTransition();

    void createTransition(SystemAnimation *animation);

private:
    Ui::DialogAnimationCreateTransition *ui;

    void translate();
};

#endif // DIALOGANIMATIONCREATETRANSITION_H
