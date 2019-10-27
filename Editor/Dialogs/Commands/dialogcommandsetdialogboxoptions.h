/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSETDIALOGBOXOPTIONS_H
#define DIALOGCOMMANDSETDIALOGBOXOPTIONS_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandSetDialogBoxOptions
//
//  A dialog used for setting dialog box options (messages).
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandSetDialogBoxOptions;
}

class DialogCommandSetDialogBoxOptions : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandSetDialogBoxOptions(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandSetDialogBoxOptions();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandSetDialogBoxOptions *ui;

public slots:
    void on_checkBoxWindowSkinID_toggled(bool checked);
    void on_checkBoxX_toggled(bool checked);
    void on_checkBoxY_toggled(bool checked);
    void on_checkBoxWidth_toggled(bool checked);
    void on_checkBoxHeight_toggled(bool checked);
    void on_checkBoxPaddingLeft_toggled(bool checked);
    void on_checkBoxPaddingTop_toggled(bool checked);
    void on_checkBoxPaddingRight_toggled(bool checked);
    void on_checkBoxPaddingBottom_toggled(bool checked);
    void on_checkBoxFacesetPosition_toggled(bool checked);
    void on_checkBoxFacesetX_toggled(bool checked);
    void on_checkBoxFacesetY_toggled(bool checked);
    void on_checkBoxTextStroke_toggled(bool checked);
    void on_checkBoxTextColor_toggled(bool checked);
    void on_checkBoxTextColorText_toggled(bool checked);
    void on_checkBoxTextColorStroke_toggled(bool checked);
    void on_checkBoxTextColorBackground_toggled(bool checked);
    void on_checkBoxTextSize_toggled(bool checked);
    void on_checkBoxTextFont_toggled(bool checked);
};

#endif // DIALOGCOMMANDSETDIALOGBOXOPTIONS_H
