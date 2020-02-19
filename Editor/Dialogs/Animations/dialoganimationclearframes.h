/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGANIMATIONCLEARFRAMES_H
#define DIALOGANIMATIONCLEARFRAMES_H

#include <QDialog>
#include "systemanimation.h"

// -------------------------------------------------------
//
//  CLASS DialogAnimationClearFrames
//
//  A dialog used for clearing frames in animations.
//
// -------------------------------------------------------


namespace Ui {
class DialogAnimationClearFrames;
}

class DialogAnimationClearFrames : public QDialog
{
    Q_OBJECT

public:
    explicit DialogAnimationClearFrames(QWidget *parent = nullptr);
    ~DialogAnimationClearFrames();

    void clearFrames(SystemAnimation *animation);

private:
    Ui::DialogAnimationClearFrames *ui;
};

#endif // DIALOGANIMATIONCLEARFRAMES_H
