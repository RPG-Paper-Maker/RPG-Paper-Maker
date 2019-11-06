/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGESCREENTONE_H
#define DIALOGCOMMANDCHANGESCREENTONE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeScreenTone
//
//  A dialog used for changing screen tone.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeScreenTone;
}

class DialogCommandChangeScreenTone : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeScreenTone(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeScreenTone();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeScreenTone *ui;

public slots:
    void on_checkBoxColor_toggled(bool checked);
    void on_spinBoxRedValueChanged(int value);
    void on_horizontalSliderRed_valueChanged(int value);
    void on_spinBoxGreenValueChanged(int value);
    void on_horizontalSliderGreen_valueChanged(int value);
    void on_spinBoxBlueValueChanged(int value);
    void on_horizontalSliderBlue_valueChanged(int value);
    void on_spinBoxGreyValueChanged(int value);
    void on_horizontalSliderGrey_valueChanged(int value);
};

#endif // DIALOGCOMMANDCHANGESCREENTONE_H
